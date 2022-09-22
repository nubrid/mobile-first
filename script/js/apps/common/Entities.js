import _ from "lodash";
import BackbonePouch from "backbone-pouch";
import PouchDB from "pouchdb";
import Primus from "primus.io";

// HACK: Force websocket if available
if ( Modernizr.websockets ) {
	const merge = Primus.prototype.merge;
	Primus.prototype.merge = function() {
		const target = merge.apply( this, arguments );

		return {
			...target,
			transports: [
				"websocket",
			],
		};
	};
}

// HACK: For primus to work with backbone.iobind
// const _emit = Primus.prototype.emit;
// Primus.prototype.emit = function() {
// 	const message = arguments[ 0 ]
// 		, delimiterIndex = message.lastIndexOf( ":" )
// 		, method = `*${message.substring( delimiterIndex )}`
// 		, sendMethods = [
// 			"*:create",
// 			"*:delete",
// 			"*:read",
// 			"*:update",
// 		];
// 	if ( arguments.length === 3 && _.indexOf( sendMethods, method ) !== -1 ) {
// 		const args = { ...arguments };
// 		args.splice( 0, 1, method );
// 		args.splice( 2, 0, message.substring( 0, delimiterIndex ) );
// 		Primus.prototype.send.apply( this, args );
// 	}
// 	else {
// 		_emit.apply( this, arguments );
// 	}
// };

if ( __DEV__ ) PouchDB.debug.enable( "pouchdb:api,pouchdb:socket:client,-engine.io-client:*" );

const db = new PouchDB( "local" );
BackboneImmutable.infect( Backbone );
Backbone.sync = BackbonePouch.sync( {
	db,
	listen: true,
	fetch: "query",
	options: {
		query: {
			include_docs: true,
			limit: 10, // TODO: Get from config.
			fun: {
				map( doc, emit ) {
					emit( doc._id, null );
				},
			},
		},
		changes: {
			include_docs: true,
			filter( doc ) {
				return doc._deleted || true; // HACK: return doc._deleted || doc.type === "todos";
			},
		},
	},
});
Backbone.Model.prototype = {
	...Backbone.Model.prototype,
	idAttribute: "_id",
	...BackbonePouch.attachments( {
		db,
	}),
};

function _getSocket( options ) {
	if ( !options ) options = {};
	return options.socket || new Primus(
		AppManager.url,
		options.closeOnOpen
			? { manual: true, strategy: false }
			: { manual: true },
	);
}

function _connect( options ) {
	if ( _.isFunction( options ) ) {
		options = { callback: options };
	}

	const primus = _getSocket( options );

	const primus_onOpen = () => {
		if ( options.callback ) {
			options.callback();
			delete options.callback; // TODO: = undefined;
		}
		if ( options.closeOnOpen ) {
			primus.end();
		}
	};

	if ( primus.readyState === Primus.OPEN ) {
		primus_onOpen();

		return primus;
	}

	primus.on( "open", function() {
		if ( __DEV__ ) console.log( "connection established" ); // eslint-disable-line no-console
		primus_onOpen();
	});

	primus.on( "end", function() {
		if ( __DEV__ ) console.log( "connection closed" ); // eslint-disable-line no-console

		if ( options.callback && options.retry ) setTimeout(() => _connect( options ), options.retry );
	});

	primus.on( "error", function( error ) {
		if ( __DEV__ ) console.log( error ); // eslint-disable-line no-console
	});

	if ( primus.readyState !== Primus.OPENING ) primus.open();

	return primus;
}

let _syncStarted = false;
export const start = () => {
	const sync = () => { // HACK: Revert if error - function() {
		const socket = _getSocket( { closeOnOpen: true });

		// HACK: Override engine.io with primus
		socket.on( "data", function( message ) {
			const sparkMessage = this.emits( "message" );
			sparkMessage( message.data[ 0 ] );
		});
		const Socket = () => {
			socket.close = socket.destroy;
			return socket;
		};

		const remotePouch = new PouchDB( "nubrid", { // TODO: Get from config.
			adapter: "socket",
			// TODO: originalName: "nubrid", // HACK: For socket-pouch to work with PouchDB v6
			url: AppManager.url,
			socketOptions: { Socket },
		});

		let localPouchSync = null;

		socket
			.on( "open", function() {
				const _log = ( type, message ) => { if ( __DEV__ ) console[ type ]( message ); }; // eslint-disable-line no-console
				localPouchSync = db.sync( remotePouch, {
					live: true,
					retry: true,
				})
					.on( "change", function( info ) {
						_log( "log", `change: ${info}` );
					})
					.on( "paused", function( error ) {
						_log( "log", `paused: ${error || ""}` );
					})
					.on( "active", function() {
						_log( "log", "active" );
					})
					.on( "complete", function( info ) {
						_log( "log", `complete: ${info}` );
					})
					.on( "denied", function( error ) {
						_log( "error", `denied: ${error}` );
					})
					.on( "error", function( error ) {
						_log( "error", `error: ${error}` );
					});
			})
			.on( "end", function() {
				if ( localPouchSync ) {
					localPouchSync.cancel();
					remotePouch.close();

					_connect( { callback: sync, closeOnOpen: true, retry: 5000 }); // TODO: Get from config.
				}
			});

		_connect( { socket });
	};

	window.PouchDB = PouchDB; // HACK: For socket-pouch to work

	// HACK: Override engine.io with primus
	const pouchDBSocket = require( "proxy!pouchdb-socket" );
	pouchDBSocket( { "engine.io-client": ( url, options ) => options.Socket() }); // eslint-disable-line new-cap

	delete window.PouchDB; // HACK: For socket-pouch to work

	if ( !_syncStarted ) sync();
	_syncStarted = true;
};

export const actionType = name => {
	if ( !name ) name = "";

	return {
		CREATE: `${name}:create`,
		UPDATE: `${name}:update`,
		DELETE: `${name}:delete`,
	};
};

export const Model = Backbone.Model.extend( {
	urlRoot: "*",
	// noIoBind: false,
	// initialize() {
	// 	this.socket = _connect( {
	// 		socket: this.socket,
	// 		callback: () => {
	// 			// Only bind new models from the server because the server assigns the id.
	// 			if ( !this.noIoBind ) {
	// 				_.bindAll( this, [ "serverChange", "serverDelete", "modelCleanup" ] );
	// 				this.ioBind( "update", this.serverChange, this );
	// 				this.ioBind( "delete", this.serverDelete, this );
	// 			}
	// 		},
	// } );

	// 	this.on( "after:save", function() {
	// 		if ( this.noIoBind ) this.socket.end();
	// 	} );
	// },
	// destroy() {
	// 	if ( !this.socket ) this.socket = this.collection.socket;

	// 	return Backbone.Model.prototype.destroy.apply( this, arguments );
	// },
	// save( attrs, options ) {
	// 	if ( !this.socket ) this.socket = this.collection.socket;

	// 	if ( !options ) options = {};

	// 	const success = options.success;
	// 	options.success = ( model, response ) => {
	// 		this.trigger( "after:save" );

	// 		if ( success ) success( model, response );
	// 	};

	// 	const error = options.error;
	// 	options.error = ( model, response ) => {
	// 		this.trigger( "after:save" );

	// 		if ( error ) error( model, response );
	// 	};

	// 	this.trigger( "before:save" );
	// 	// Call super with attrs moved to options
	// 	Backbone.Model.prototype.save.call( this, attrs, options );
	// 	return this;
	// },
	// serverChange( data ) {
	// 	if ( !this.socket ) this.socket = this.collection.socket;

	// 	if ( this.changedAttributes( data ) ) this.set( data );
	// },
	// serverDelete() {
	// 	if ( !this.socket ) this.socket = this.collection.socket;

	// 	this.modelCleanup();

	// 	if ( this.collection ) {
	// 		this.collection.remove( this );
	// 	} else {
	// 		this.trigger( "remove", this );
	// 	}
	// },
	// modelCleanup() {
	// 	this.ioUnbindAll();
	// 	return this;
	// },
});

export const Collection = Backbone.Collection.extend( {
	url: "*",
	// noIoBind: false,
	model: Model,
	initialize() {
		this.actionType = actionType( this.url );

		this.listenTo( this.dispatcher, "dispatch", payload => {
			switch ( payload.actionType ) {
				case this.actionType.CREATE:
					this.create( _.omit( payload.attrs, [ "id", "_id", "_rev", "actionType" ] ), { wait: true });

					break;
				case this.actionType.UPDATE:
					this.get( payload.id ).save( _.omit( payload.attrs, [ "id", "actionType" ] ), { wait: true });

					break;
				case this.actionType.DELETE:
					this.get( payload.id ).destroy();

					break;
			}
		});

		// this.on( "before:fetch", function() {
		// 	this.socket = _connect( {
		// 		socket: this.socket,
		// 		callback() {
		// 			if ( !this.noIoBind ) {
		// 				_.bindAll( this, [ "serverCreate", "collectionCleanup" ] );
		// 				this.ioBind( "create", this.serverCreate, this );
		// 			}

		// 			this.model = this.model.extend( { socket: this.socket } );
		// 		},
		// 	} );
		// } );
		// this.on( "after:fetch", function() {
		// 	if ( this.noIoBind ) this.socket.end();
		// } );
	},
	// fetch() {
	// 	let args = arguments;
	// 	if ( !args || args.length === 0 ) args = [{}];

	// 	const success = args[ 0 ].success;
	// 	args[ 0 ].success = data => {
	// 		this.trigger( "after:fetch" );

	// 		if ( success ) success( data );
	// 	};

	// 	const error = args[ 0 ].error;
	// 	args[ 0 ].error = data => {
	// 		this.trigger( "after:fetch" );

	// 		if ( error ) error( data );
	// 	};

	// 	this.trigger( "before:fetch" );
	// 	return Backbone.Collection.prototype.fetch.apply( this, args );
	// },
	parse( response ) {
		return Array.from( response.rows, row => row.doc );
	},
	// serverCreate( data ) {
	// 	const oldData = this.get( data._id );
	// 	// Check for duplicates in the collection.
	// 	if ( !oldData ) {
	// 		this.add( data );
	// 	} else {
	// 		if ( oldData.changedAttributes( data ) ) oldData.set( data );
	// 	}
	// },
	// collectionCleanup() {
	// 	this.ioUnbindAll();
	// 	this.each( model => model.modelCleanup() );

	// 	return this;
	// },
	close() {
		this.stopListening( this.dispatcher );
		// if ( this.socket ) this.socket.end();
	},
});

export const getEntity = ( options ) => {
	start();

	const { dispatcher, query, url, url: urlRoot } = options
		, _Collection = Collection.extend( {
			model: Model.extend( {
				urlRoot,
			}),
			url,
			dispatcher,
		})
		, collection = new _Collection( null, options );
	// collection.socket = _connect( {
	// 	socket: collection.socket,
	// 	callback() {
	return new Promise(( resolve/*, reject*/ ) => collection.fetch( {
		data: {
			query, // TODO: dynamic query for PouchDB
		},
		success( data ) {
			resolve( {
				data,
				actionType: collection.actionType,
			});
		},
	}) );
	// 	},
	// } );
};

export const getModel = ( { _Model, attrs }) => {
	const model = new _Model( attrs );
	// model.socket = _connect( {
	// 	socket: model.socket,
	// 	callback() {
	return new Promise(( resolve/*, reject*/ ) => model.fetch( {
		success( data ) {
			resolve( data );
		},
	}) );
	// 	},
	// } );
};