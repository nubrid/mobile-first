var Seed = require("seed");

var App = {};

App.Todo = Seed.Model.extend("todo", {
	schema: new Seed.Schema({
		title: String
		, completed: Boolean
	})
});

App.Todos = Seed.Graph.extend({
	initialize: function () {
		this.define(App.Todo);
	}
});

var db = new App.Todos()
	, guid = new Seed.ObjectId();

// HACK: v1.0
//var io = require("socket.io")();
var io = require("socket.io").listen(8082);

io.on("connection", function (socket) {
	/*
	Triggered when todo.save() is called.
	We listen on model namespace, but emit on the collection namespace.
	*/
	socket.on("todo:create", function (data, callback) {
		var id = guid.gen()
			, todo = db.set("/todo/" + id, data)
			, json = todo._attributes;

		socket.emit("todos:create", json);
		socket.broadcast.emit("todos:create", json);
		callback(null, json);
	});

	/*
	Triggered when todos.fetch() is called.
	*/
	socket.on("todos:read", function (data, callback) {
		var list = [];

		db.each("todo", function (todo) {
			list.push(todo._attributes);
		});

		callback(null, list);
	});

	/*
	Triggered when todo.save() is called.
	*/
	socket.on("todo:update", function (data, callback) {
		var todo = db.get("/todo/" + data.id);
		todo.set(data);

		var json = todo._attributes;

		socket.emit("todo/" + data.id + ":update", json);
		socket.broadcast.emit("todo/" + data.id + ":update", json);
		callback(null, json);
	});

	/*
	Triggered when todo.destroy() is called.
	*/
	socket.on("todo:delete", function (data, callback) {
		var json = db.get("/todo/" + data.id)._attributes;

		db.del("/todo/" + data.id);

		socket.emit("todo/" + data.id + ":delete", json);
		socket.broadcast.emit("todo/" + data.id + ":delete", json);
		callback(null, json);
	});

	// TODO: Sample postgres
	socket.on("getById", function (userId, callback) {
		var pg = require("pg");
		var connString = "tcp://postgres:Password1@localhost:5432/ThreeDegree";
		var client = new pg.Client(connString);
		client.connect();

		var query = client.query('SELECT "ID", "FirstName", "LastName", "Email" FROM "3"."User" WHERE "ID" = $1', [userId]);

		query.on("row", function (row) {
			callback(row);
		});

		query.on("end", function () { client.end(); });
	});
});
// HACK: v1.0
//io.listen(8082);
console.log("Listening at port 8082");