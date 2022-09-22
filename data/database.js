let config = require("../app.config")
	, _ = require("underscore")
	, pg = require("pg");
export let db = new pg.Client(config.db);

db.connect();
db.on("error", (error, client) => console.error("Could not connect to postgres", error));
db.on("notice", notice => console.info(notice));

db.create = (table, data, callback) => {
	db.query(`INSERT INTO ${table.replace(/[^A-Z0-9]/ig, "_")} (data) VALUES ($1) RETURNING id, data`, [JSON.stringify(_.omit(data, "id"))], (error, result) => {
		error ? callback(null, error)
			: callback(JSON.stringify(_.extend({ id: result.rows[0].id }, result.rows[0].data)));
	});
};
db.read = (table, callback) => {
	db.query(`SELECT * FROM ${table.replace(/[^A-Z0-9]/ig, "_")}`, (error, result) => {
		error ? callback(null, error)
			: callback(_.map(result.rows, row => _.extend({ id: row.id }, row.data)));
	});
};
db.update = (table, data, callback) => {
	db.query(`UPDATE ${table.replace(/[^A-Z0-9]/ig, "_")} SET data = $1 WHERE id = $2 RETURNING id, data`, [JSON.stringify(_.omit(data, "id")), data.id], (error, result) => {
		error ? callback(null, error)
			: callback(JSON.stringify(_.extend({ id: result.rows[0].id }, result.rows[0].data)));
	});
};
db.delete = (table, data, callback) => {
	db.query(`DELETE FROM ${table.replace(/[^A-Z0-9]/ig, "_")} WHERE id = $1`, [data.id], (error, result) => {
		error ? callback(null, error)
			: callback(result.rows[0]);
	});
};
// TODO: node-rest-client
// let Client = require("node-rest-client").Client;
// export let db = new Client();

// db.create = db.post;
// db.read = db.get;
// db.update = db.put;