import AppManager from "apps/AppManager";
import { infect, PureRenderMixin } from "backbone.immutable";
import PouchDB from "pouchdb";
import { attachments, sync } from "backbone.pouchdb";
let Common = { PureRenderMixin };
infect(Backbone);

// HACK: Force websocket if available.
if (Modernizr.websockets) {
	let _merge = Primus.prototype.merge;
	Primus.prototype.merge = function () {
		let target = _merge.apply(this, arguments);

		return _.extend(target, {
			transports: [
				"websocket"
			]
		});
	};
}

// HACK: For compatibility of primus with backbone.iobind.
// let _emit = Primus.prototype.emit;
// let _sendMethods = [
// 	"*:create"
// 	, "*:delete"
// 	, "*:read"
// 	, "*:update"
// ];
// Primus.prototype.emit = function () {
// 	let message = arguments[0]
// 		, delimiterIndex = message.lastIndexOf(":")
// 		, method = "*" + message.substring(delimiterIndex);
// 	if (arguments.length === 3 && _.indexOf(_sendMethods, method) !== -1) {
// 		let args = _.extend([], arguments);
// 		args.splice(0, 1, method);
// 		args.splice(2, 0, message.substring(0, delimiterIndex));
// 		Primus.prototype.send.apply(this, args);
// 	}
// 	else {
// 		_emit.apply(this, arguments);
// 	}
// };

function _getSocket (options) {
	options = options || {};
	return options.socket || new Primus(window.url
		, options.closeOnOpen
		? { manual: true, strategy: false }
		: { manual: true });
}

function _connect (options) {
	if (_.isFunction(options)) {
		options = { callback: options };
	}

	let primus = _getSocket(options);

	function primus_onOpen() {
		if (options.callback) {
			options.callback();
			options.callback = undefined;
		}
		if (options.closeOnOpen) {
			primus.end();
		}
	}

	if (primus.readyState === Primus.OPEN) {
		primus_onOpen();

		return primus;
	}

	primus.on("open", function () {
		console.log("connection established");
		primus_onOpen();
	});

	primus.on("end", function () {
		console.log("connection closed");

		if (options.callback && options.retry) setTimeout(() => _connect(options), options.retry);
	});

	primus.on("error", function (error) {
		console.log(error);
	});

	if (primus.readyState !== Primus.OPENING) primus.open();

	return primus;
}

if (window.isDEV) PouchDB.debug.enable("*");

Backbone.Model.prototype.idAttribute = "_id";
let localPouch = new PouchDB("local");
Backbone.sync = sync({
	db: localPouch
	, listen: true
	, fetch: "query"
	, options: {
		query: {
			include_docs: true
			, limit: 10
			, fun: {
				map( doc, emit ) {
					emit( doc._id, null );
				}
			}
		}
		, changes: {
			include_docs: true
			, filter( doc ) {
				return doc._deleted || true; // TODO: return doc._deleted || doc.type === "todos";
			}
		}
	}
});
_.extend(Backbone.Model.prototype, attachments({
  db: localPouch
}));

if (!window.PouchDB) {
	window.PouchDB = PouchDB;

	let sync = function () {
		let socket = _getSocket({ closeOnOpen: true });
		// HACK: Override engine.io with primus
		socket.on("data", function (message) {
			let sparkMessage = this.emits("message");
			sparkMessage( message.data[0] );
		});
		function Socket () {
			socket.close = socket.destroy;
			return socket;
		}
		let remotePouch = new PouchDB("nubrid", {
			adapter: "socket"
			, url: window.url
			, Socket
		});

		let localPouchSync = null;

		socket.on("open", function () {
			localPouchSync = localPouch.sync(remotePouch, {
				live: true
				, retry: true
			})
			.on("change", function( info ) {
				console.log("change: ", info);
			})
			.on("paused", function( error ) {
				console.log("paused: ", error);
			})
			.on("active", function () {
				console.log("active");
			})
			.on("denied", function ( error ) {
				console.log("denied: ", error);
			})
			.on("complete", function( info ) {
				console.log("complete: ", info);
			})
			.on("error", function( error ) {
				console.log("error: ", error);
			});
		});
		socket.on("end", () => {
			if (localPouchSync) {
				localPouchSync.cancel();
				remotePouch.close();

				_connect({ callback: sync, closeOnOpen: true, retry: 5000 });
			}
		});

		_connect({ socket });
	};

	require(["pouchdb.socket"], sync);
}

Common.ActionType = name => {
	name = name || "";

	return {
		CREATE: `${name}:create`
		, UPDATE: `${name}:update`
		, DELETE: `${name}:delete`
	};
};

Common.Model = Backbone.Model.extend({
	urlRoot: "*"
	// , noIoBind: false
	// , initialize () {
	// 	this.socket = _connect({
	// 		socket: this.socket
	// 		, callback: () => {
	// 			// Only bind new models from the server because the server assigns the id.
	// 			if (!this.noIoBind) {
	// 				_.bindAll(this, "serverChange", "serverDelete", "modelCleanup");
	// 				this.ioBind("update", this.serverChange, this);
	// 				this.ioBind("delete", this.serverDelete, this);
	// 			}
	// 		}
		// });

	// 	this.on("after:save", function () {
	// 		if (this.noIoBind) this.socket.end();
	// 	});
	// }
	// , destroy () {
	// 	if (!this.socket) this.socket = this.collection.socket;

	// 	return Backbone.Model.prototype.destroy.apply(this, arguments);
	// }
	// , save( attrs, options ) {
	// 	if (!this.socket) this.socket = this.collection.socket;

	// 	options = options || {};

	// 	let success = options.success;
	// 	options.success = (model, response) => {
	// 		this.trigger("after:save");

	// 		if (success) success(model, response);
	// 	};

	// 	let error = options.error;
	// 	options.error = (model, response) => {
	// 		this.trigger("after:save");

	// 		if (error) error(model, response);
	// 	};

	// 	this.trigger("before:save");
	// 	// Call super with attrs moved to options
	// 	Backbone.Model.prototype.save.call(this, attrs, options);
	// 	return this;
	// }
	// , serverChange( data ) {
	// 	if (!this.socket) this.socket = this.collection.socket;

	// 	if (this.changedAttributes(data)) this.set(data);
	// }
	// , serverDelete () {
	// 	if (!this.socket) this.socket = this.collection.socket;

	// 	this.modelCleanup();

	// 	if (this.collection) {
	// 		this.collection.remove(this);
	// 	} else {
	// 		this.trigger("remove", this);
	// 	}
	// }
	// , modelCleanup () {
	// 	this.ioUnbindAll();
	// 	return this;
	// }
});

Common.Collection = Backbone.Collection.extend({
	url: "*"
	// , noIoBind: false
	, model: Common.Model
	, initialize () {
		this.actionType = Common.ActionType(this.url);

		this.listenTo(this.dispatcher, "dispatch", payload => {
			switch (payload.actionType) {
				case this.actionType.CREATE:
					this.create(_.omit(payload.action.attrs, [ "id", "_id", "_rev" ]), { wait: true });

					break;
				case this.actionType.UPDATE:
					this.get(payload.action.id).save(_.omit(payload.action.attrs, "id"), { wait: true });

					break;
				case this.actionType.DELETE:
					this.get(payload.action.id).destroy();

					break;
			}
		});

		// this.on("before:fetch", function () {
		// 	this.socket = _connect({
		// 		socket: this.socket
		// 		, callback: () => {
		// 			if (!this.noIoBind) {
		// 				_.bindAll(this, "serverCreate", "collectionCleanup");
		// 				this.ioBind("create", this.serverCreate, this);
		// 			}

		// 			this.model = this.model.extend({ socket: this.socket });
		// 		}
		// 	});
		// });
		// this.on("after:fetch", function () {
		// 	if (this.noIoBind) this.socket.end();
		// });
	}
	// , fetch () {
	// 	let args = arguments;
	// 	if (!args || args.length === 0) args = [{}];

	// 	let success = args[0].success;
	// 	args[0].success = data => {
	// 		this.trigger("after:fetch");

	// 		if (success) success(data);
	// 	};

	// 	let error = args[0].error;
	// 	args[0].error = data => {
	// 		this.trigger("after:fetch");

	// 		if (error) error(data);
	// 	};

	// 	this.trigger("before:fetch");
	// 	return Backbone.Collection.prototype.fetch.apply(this, args);
	// }
	, parse( response ) {
		return _.pluck( response.rows, "doc" );
	}
	// , serverCreate( data ) {
	// 	let oldData = this.get(data._id);
	// 	// Check for duplicates in the collection.
	// 	if (!oldData) {
	// 		this.add(data);
	// 	} else {
	// 		if (oldData.changedAttributes(data)) oldData.set(data);
	// 	}
	// }
	// , collectionCleanup () {
	// 	this.ioUnbindAll();
	// 	this.each(function (model) {
	// 		model.modelCleanup();
	// 	});

	// 	return this;
	// }
	, close () {
		this.stopListening(this.dispatcher);
		// if (this.socket) this.socket.end();
	}
});

Common.API = {
	getModel( Model, attrs ) {
		let model = new Model(attrs)
			, defer = $.Deferred();
		// model.socket = _connect({
		// 	socket: model.socket
		// 	, callback () {
		model.fetch({
			success( data ) {
				defer.resolve(data);
			}
		});
		// 	}
		// });

		return defer.promise();
	}
	, getEntity( Collection, options ) {
		let collection = new Collection(null, options)
			, defer = $.Deferred();
		// collection.socket = _connect({
		// 	socket: collection.socket
		// 	, callback () {
		collection.fetch({
			success( data ) {
				defer.resolve(data);
			}, data: {
				query: options.query
			}
		});
		// 	}
		// });

		return {
			fetch: defer.promise()
			, actionType: collection.actionType
		};
	}
};

AppManager.reqres.setHandler("connect", _connect);

AppManager.reqres.setHandler("entity", options => {
	return Common.API.getEntity(
		Common.Collection.extend({
			model: Common.Model.extend({
				urlRoot: options.url
			})
			, url: options.url
			, dispatcher: options.dispatcher
		})
		, options);
});

export default Common;