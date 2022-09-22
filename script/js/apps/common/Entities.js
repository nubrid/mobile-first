/*
Common Entities
*/
const _common = {};
BackboneImmutable.infect( Backbone );

// HACK: Force websocket if available.
if ( Modernizr.websockets ) {
	const merge = Primus.prototype.merge;
	Primus.prototype.merge = function() {
		const target = merge.apply( this, arguments );

		return _.extend( target, {
			transports: [
				"websocket"
			]
		} );
	};
}

// HACK: For compatibility of primus with backbone.iobind.
// const _emit = Primus.prototype.emit;
// Primus.prototype.emit = function() {
// 	const message = arguments[ 0 ]
// 		, delimiterIndex = message.lastIndexOf( ":" )
// 		, method = "*" + message.substring( delimiterIndex )
// 		, sendMethods = [
// 			"*:create"
// 			, "*:delete"
// 			, "*:read"
// 			, "*:update"
// 		];
// 	if ( arguments.length === 3 && _.indexOf( sendMethods, method ) !== -1 ) {
// 		const args = _.extend( [], arguments );
// 		args.splice( 0, 1, method );
// 		args.splice( 2, 0, message.substring( 0, delimiterIndex ) );
// 		Primus.prototype.send.apply( this, args );
// 	}
// 	else {
// 		_emit.apply( this, arguments );
// 	}
// };

function _getSocket( options ) {
	if ( !options ) options = {};
	return options.socket || new Primus(
		window.url
		, options.closeOnOpen
			? { manual: true, strategy: false }
			: { manual: true }
	);
}

function _connect( options ) {
	if ( _.isFunction( options ) ) {
		options = { callback: options };
	}

	const primus = _getSocket( options );

	function primus_onOpen() {
		if ( options.callback ) {
			options.callback();
			options.callback = undefined;
		}
		if ( options.closeOnOpen ) {
			primus.end();
		}
	}

	if ( primus.readyState === Primus.OPEN ) {
		primus_onOpen();

		return primus;
	}

	primus.on( "open", function() {
		console.log( "connection established" );
		primus_onOpen();
	} );

	primus.on( "end", function() {
		console.log( "connection closed" );

		if ( options.callback && options.retry ) setTimeout( () => _connect( options ), options.retry );
	} );

	primus.on( "error", function( error ) {
		console.log( error );
	} );

	if ( primus.readyState !== Primus.OPENING ) primus.open();

	return primus;
}

if ( __DEV__ ) PouchDB.debug.enable( "*" );

Backbone.Model.prototype.idAttribute = "_id";
const _localPouch = new PouchDB( "local" );
Backbone.sync = BackbonePouch.sync( {
	db: _localPouch
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
} );
_.extend( Backbone.Model.prototype, BackbonePouch.attachments( {
  db: _localPouch
} ) );

if ( !window.PouchDB ) {
	window.PouchDB = PouchDB;

	const sync = function() {
		const socket = _getSocket( { closeOnOpen: true } );
		// HACK: Override engine.io with primus
		socket.on( "data", function( message ) {
			const sparkMessage = this.emits( "message" );
			sparkMessage( message.data[ 0 ] );
		} );
		function Socket() {
			socket.close = socket.destroy;
			return socket;
		}
		const remotePouch = new PouchDB( "nubrid", {
			adapter: "socket"
			, url: window.url
			, socketOptions: { Socket }
		} );

		let localPouchSync = null;

		socket
		.on( "open", function() {
			localPouchSync = _localPouch.sync( remotePouch, {
				live: true
				, retry: true
			} )
			.on( "change", function( info ) {
				console.log( "change: ", info );
			} )
			.on( "paused", function( error ) {
				console.log( "paused: ", error );
			} )
			.on( "active", function() {
				console.log( "active" );
			} )
			.on( "denied", function( error ) {
				console.log( "denied: ", error );
			} )
			.on( "complete", function( info ) {
				console.log( "complete: ", info );
			} )
			.on( "error", function( error ) {
				console.log( "error: ", error );
			} );
		} )
		.on( "end", function() {
			if ( localPouchSync ) {
				localPouchSync.cancel();
				remotePouch.close();

				_connect( { callback: sync, closeOnOpen: true, retry: 5000 } );
			}
		} );

		_connect( { socket } );
	};

	const pouchDBSocket = require( "proxy!pouchdb.socket" );
	pouchDBSocket( { "engine.io-client": ( url, options ) => options.Socket() } ); // HACK: Override engine.io with primus
	sync();
}

_common.ActionType = name => {
	if ( !name ) name = "";

	return {
		CREATE: `${name}:create`
		, UPDATE: `${name}:update`
		, DELETE: `${name}:delete`
	};
};

_common.Model = Backbone.Model.extend( {
	urlRoot: "*"
	// , noIoBind: false
	// , initialize() {
	// 	this.socket = _connect( {
	// 		socket: this.socket
	// 		, callback: () => {
	// 			// Only bind new models from the server because the server assigns the id.
	// 			if ( !this.noIoBind ) {
	// 				_.bindAll( this, "serverChange", "serverDelete", "modelCleanup" );
	// 				this.ioBind( "update", this.serverChange, this );
	// 				this.ioBind( "delete", this.serverDelete, this );
	// 			}
	// 		}
		// } );

	// 	this.on( "after:save", function() {
	// 		if ( this.noIoBind ) this.socket.end();
	// 	} );
	// }
	// , destroy() {
	// 	if ( !this.socket ) this.socket = this.collection.socket;

	// 	return Backbone.Model.prototype.destroy.apply( this, arguments );
	// }
	// , save( attrs, options ) {
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
	// }
	// , serverChange( data ) {
	// 	if ( !this.socket ) this.socket = this.collection.socket;

	// 	if ( this.changedAttributes( data ) ) this.set( data );
	// }
	// , serverDelete() {
	// 	if ( !this.socket ) this.socket = this.collection.socket;

	// 	this.modelCleanup();

	// 	if ( this.collection ) {
	// 		this.collection.remove( this );
	// 	} else {
	// 		this.trigger( "remove", this );
	// 	}
	// }
	// , modelCleanup() {
	// 	this.ioUnbindAll();
	// 	return this;
	// }
});

_common.Collection = Backbone.Collection.extend( {
	url: "*"
	// , noIoBind: false
	, model: _common.Model
	, initialize() {
		this.actionType = _common.ActionType( this.url );

		this.listenTo( this.dispatcher, "dispatch", payload => {
			switch ( payload.actionType ) {
				case this.actionType.CREATE:
					this.create( _.omit( payload.action.attrs, [ "id", "_id", "_rev" ] ), { wait: true } );

					break;
				case this.actionType.UPDATE:
					this.get( payload.action.id ).save( _.omit( payload.action.attrs, "id" ), { wait: true } );

					break;
				case this.actionType.DELETE:
					this.get( payload.action.id ).destroy();

					break;
			}
		} );

		// this.on( "before:fetch", function() {
		// 	this.socket = _connect( {
		// 		socket: this.socket
		// 		, callback: () => {
		// 			if ( !this.noIoBind ) {
		// 				_.bindAll( this, "serverCreate", "collectionCleanup" );
		// 				this.ioBind( "create", this.serverCreate, this );
		// 			}

		// 			this.model = this.model.extend( { socket: this.socket } );
		// 		}
		// 	} );
		// } );
		// this.on( "after:fetch", function() {
		// 	if ( this.noIoBind ) this.socket.end();
		// } );
	}
	// , fetch() {
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
	// }
	, parse( response ) {
		return _.pluck( response.rows, "doc" );
	}
	// , serverCreate( data ) {
	// 	const oldData = this.get( data._id );
	// 	// Check for duplicates in the collection.
	// 	if ( !oldData ) {
	// 		this.add( data );
	// 	} else {
	// 		if ( oldData.changedAttributes( data ) ) oldData.set( data );
	// 	}
	// }
	// , collectionCleanup() {
	// 	this.ioUnbindAll();
	// 	this.each( model => model.modelCleanup() );

	// 	return this;
	// }
	, close() {
		this.stopListening( this.dispatcher );
		// if ( this.socket ) this.socket.end();
	}
} );

_common.API = {
	getModel( Model, attrs ) {
		const model = new Model( attrs )
			, defer = $.Deferred();
		// model.socket = _connect( {
		// 	socket: model.socket
		// 	, callback() {
		model.fetch( {
			success( data ) {
				defer.resolve( data );
			}
		} );
		// 	}
		// } );

		return defer.promise();
	}
	, getEntity( Collection, options ) {
		const collection = new Collection( null, options )
			, defer = $.Deferred();
		// collection.socket = _connect( {
		// 	socket: collection.socket
		// 	, callback() {
		collection.fetch( {
			data: {
				query: options.query // TODO: dynamic query for PouchDB
			}
			, success( data ) {
				defer.resolve( data );
			}
		} );
		// 	}
		// } );

		return {
			fetch: defer.promise()
			, actionType: collection.actionType
		};
	}
};

AppManager.reqres.setHandler( "connect", _connect );

AppManager.reqres.setHandler( "entity", options =>
	_common.API.getEntity(
		_common.Collection.extend( {
			model: _common.Model.extend( {
				urlRoot: options.url
			} )
			, url: options.url
			, dispatcher: options.dispatcher
		} )
		, options
	)
);

export default _common;