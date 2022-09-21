var config = require("./Nubrid.Config")
	, cluster = require("cluster")
	, protocol = process.argv[2] ? process.argv[2] : "http"
	, redirection = process.argv[3] ? process.argv[3] : "httptohttps"
	, disableCluster = process.argv[4] ? process.argv[4] : config.web.disableCluster
	, port = process.argv[5]
		? process.argv[5]
		: (process.env.PORT || (protocol == "https"
			? config.web.sslPort
			: config.web.port));

if (cluster.isMaster && !disableCluster) {
	// Fork workers.
	var numCPUs = require("os").cpus().length
		, multiplier = port < 100 ? 100 : (port < 1000 ? 10 : 1);
	for (var i = 0; i < numCPUs; i++) {
		cluster.fork({ PORT: (i == 0 ? port : (port * multiplier) + i) });
	}

	cluster.on("exit", function (worker, code, signal) {
		console.log("worker " + worker.process.pid + " died");
	});
}
else {
	var passport = require("passport")
	, FacebookStrategy = require("passport-facebook").Strategy
	, TwitterStrategy = require("passport-twitter").Strategy
	, LinkedInStrategy = require("passport-linkedin").Strategy;

	passport.serializeUser(function (user, done) {
		done(null, user);
	});

	passport.deserializeUser(function (obj, done) {
		done(null, obj);
	});

	passport.use(
		new FacebookStrategy({
			clientID: config.fb.clientID
			, clientSecret: config.fb.clientSecret
			, callbackURL: "/auth/facebook/callback"
		}
		, function (accessToken, refreshToken, profile, done) {
			console.log(profile);
			process.nextTick(function () {
				return done(null, profile);
				//User.findOrCreate(null, function (err, user) {
				//	if (err) { return done(err); }
				//	done(null, user);
				//});
			});
		})
	);

	passport.use(
		new TwitterStrategy({
			consumerKey: config.twit.consumerKey
			, consumerSecret: config.twit.consumerSecret
			, callbackURL: "/auth/twitter/callback"
		}
		, function (token, tokenSecret, profile, done) {
			console.log(profile);
			return done(null, profile);
			process.nextTick(function () {
				//User.findOrCreate(null, function(err, user) {
				//	if (err) { return done(err); }
				//	done(null, user);
				//});
			});
		})
	);

	passport.use(
		new LinkedInStrategy({
			consumerKey: config.linkedin.consumerKey
			, consumerSecret: config.linkedin.consumerSecret
			, callbackURL: "/auth/linkedin/callback"
		}
		, function (token, tokenSecret, profile, done) {
			console.log(profile);
			process.nextTick(function () {
				return done(null, profile);
				//User.findOrCreate({ linkedinId: profile.id }, function (err, user) {
				//	return done(err, user);
				//});
			});
		})
	);

	var options = null;

	if (protocol == "https") {
		var fs = require("fs")
			, constants = require("constants");

		options = {
			ca: [fs.readFileSync(config.web.sslCa)]
			, key: fs.readFileSync(config.web.sslKey)
			, cert: fs.readFileSync(config.web.sslCrt)
			, secureOptions: constants.SSL_OP_NO_SSLv3 | constants.SSL_OP_NO_SSLv2
		};
	}

	var express = require("express")
		, app = express()
		, static = require("node-static")
		, file = new static.Server(config.web.dir, { cache: config.web.cache });

	app.configure(function () {
		//app.use(express.static(config.web.dir));
		app.use(express.cookieParser());
		app.use(express.bodyParser());
		app.use(express.session({ secret: "8AC782B6-0219-499B-A8EF-ABAE4325C513" }));
		app.use(passport.initialize());
		app.use(passport.session());
		app.use(app.router);
		app.use(function (request, response) {
			if (protocol == "http" && redirection == "httptohttps") {
				response.writeHead(301, { "Location": "https://" + request.headers["host"] + request.url });
				response.end();

				return;
			}
			else if (protocol == "https" && redirection == "httpstohttp") {
				response.writeHead(301, { "Location": "http://" + request.headers["host"] + request.url });
				response.end();

				return;
			}

			request.addListener("end", function () {
				file.serve(request, response);
			}).resume();
		});
	});

	app.get("/auth/facebook", passport.authenticate("facebook", {
		//scope: [
		//	"read_stream"
		//	, "publish_actions"
		//]
	}));

	app.get("/auth/facebook/callback", passport.authenticate("facebook", {
		successRedirect: "/",
		failureRedirect: "/#failed"
	}));

	app.get("/auth/twitter", passport.authenticate("twitter", {
		//scope: [
		//	"read_stream"
		//	, "publish_actions"
		//]
	}));

	app.get("/auth/twitter/callback", passport.authenticate("twitter", {
		successRedirect: "/",
		failureRedirect: "/#failed"
	}));

	app.get("/auth/linkedin", passport.authenticate("linkedin", {
		//scope: [
		//	"read_stream"
		//	, "publish_actions"
		//]
	}));

	app.get("/auth/linkedin/callback", passport.authenticate("linkedin", {
		successRedirect: "/",
		failureRedirect: "/#failed"
	}));

	/*
	Temp DB
	*/
	var Seed = require("seed")
		, App = {};

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
	/*
	Temp DB
	*/

	var http = require(protocol)
		, server = protocol == "https" ? http.createServer(options, app) : http.createServer(app);

	http.globalAgent.maxSockets = config.web.maxSockets;

	var Primus = require("primus.io")
		, primus = new Primus(server, { transformer: config.primus.transformer });

	primus.use("broadcast", require("primus-broadcast"));

	var Client = require("node-rest-client").Client;
	client = new Client();

	primus.on("connection", function (spark) {
		console.log("connected:", spark.address.ip);

		/*
		Triggered when todo.save() is called.
		We listen on model namespace, but emit on the collection namespace.
		*/
		spark.on("todo:create", function (data, callback) {
			var id = guid.gen()
		  , todo = db.set("/todo/" + id, data)
		  , json = todo._attributes;

			spark.send("todos:create", json);
			spark.broadcast("todos:create", json);
			callback(null, json);
		});

		/*
		Triggered when todos.fetch() is called.
		*/
		spark.on("todos:read", function (data, callback) {
			var list = [];

			db.each("todo", function (todo) {
				list.push(todo._attributes);
			});

			callback(null, list);
		});

		/*
		Triggered when todo.save() is called.
		*/
		spark.on("todo:update", function (data, callback) {
			var todo = db.get("/todo/" + data.id);
			todo.set(data);

			var json = todo._attributes;

			spark.send("todo/" + data.id + ":update", json);
			spark.broadcast("todo/" + data.id + ":update", json);
			callback(null, json);
		});

		/*
		Triggered when todo.destroy() is called.
		*/
		spark.on("todo:delete", function (data, callback) {
			var json = db.get("/todo/" + data.id)._attributes;

			db.del("/todo/" + data.id);

			spark.send("todo/" + data.id + ":delete", json);
			spark.broadcast("todo/" + data.id + ":delete", json);
			callback(null, json);
		});

		// TODO: Sample postgres
		spark.on("getById", function (userId, callback) {
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

		spark.on("end", function () {
			console.log("closed:", spark.address.ip);
		});
	});

	process.on("uncaughtException", function (error) {
		console.log(error);
	});

	server.listen(port);
	console.log("Listening at port " + port);
}