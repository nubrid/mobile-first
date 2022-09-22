let Client = require("node-rest-client").Client;
export let db = new Client();
db.create = db.post;
db.read = db.get;
db.update = db.put;