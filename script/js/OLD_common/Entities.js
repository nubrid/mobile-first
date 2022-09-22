/*
Common Entities
*/
import _ from "lodash/fp";
// TODO: import BackbonePouch from "backbone-pouch";
// import PouchDB from "pouchdb";
import Primus from "primus.io";

// HACK: Force websocket if available.
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

// HACK: For compatibility of primus with backbone.iobind.
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

if ( __DEV__ ) PouchDB.debug.enable( "*" );

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
} );

Backbone.Model.prototype = {
	...Backbone.Model.prototype,
	idAttribute: "_id",
	...BackbonePouch.attachments( {
		db,
	} ),
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
			options.callback = undefined;
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
	} );

	primus.on( "end", function() {
		if ( __DEV__ ) console.log( "connection closed" ); // eslint-disable-line no-console

		if ( options.callback && options.retry ) setTimeout( () => _connect( options ), options.retry );
	} );

	primus.on( "error", function( error ) {
		if ( __DEV__ ) console.log( error ); // eslint-disable-line no-console
	} );

	if ( primus.readyState !== Primus.OPENING ) primus.open();

	return primus;
}

let _syncStarted = false;
export const start = () => {
	const sync = () => {
		const socket = _getSocket( { closeOnOpen: true } );
		// HACK: Override engine.io with primus
		socket.on( "data", function( message ) {
			const sparkMessage = this.emits( "message" );
			sparkMessage( message.data[ 0 ] );
		} );
		const Socket = () => {
			socket.close = socket.destroy;
			return socket;
		};
		const remotePouch = new PouchDB( "nubrid", { // TODO: Get from config.
			adapter: "socket",
			originalName: "nubrid", // HACK: PouchDB v6
			url: AppManager.url,
			socketOptions: { Socket },
		} );

		let localPouchSync = null;

		socket
			.on( "open", function() {
				localPouchSync = db.sync( remotePouch, {
					live: true,
					retry: true,
				} )
					.on( "change", function( info ) {
						if ( __DEV__ ) console.log( "change: ", info ); // eslint-disable-line no-console
					} )
					.on( "paused", function( error ) {
						if ( __DEV__ ) console.log( "paused: ", error ); // eslint-disable-line no-console
					} )
					.on( "active", function() {
						if ( __DEV__ ) console.log( "active" ); // eslint-disable-line no-console
					} )
					.on( "denied", function( error ) {
						if ( __DEV__ ) console.log( "denied: ", error ); // eslint-disable-line no-console
					} )
					.on( "complete", function( info ) {
						if ( __DEV__ ) console.log( "complete: ", info ); // eslint-disable-line no-console
					} )
					.on( "error", function( error ) {
						if ( __DEV__ ) console.log( "error: ", error ); // eslint-disable-line no-console
					} );
			} )
			.on( "end", function() {
				if ( localPouchSync ) {
					localPouchSync.cancel();
					remotePouch.close();

					_connect( { callback: sync, closeOnOpen: true, retry: 5000 } ); // TODO: Get from config.
				}
			} );

		_connect( { socket } );
	};

	// HACK: Required by socket-pouch
	window.PouchDB = PouchDB;
	const pouchDBSocket = null; // TODO: require( "proxy-loader!pouchdb-socket" );
	// HACK: Override engine.io with primus
	pouchDBSocket( { "engine.io-client": ( url, options ) => options.Socket() } ); // eslint-disable-line new-cap
	delete window.PouchDB;
	
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
} );

export const Collection = Backbone.Collection.extend( {
	url: "*",
	model: Model,

	initialize() {
		this.actionType = actionType( this.url );

		this.listenTo( this.dispatcher, "dispatch", payload => {
			switch ( payload.actionType ) {
				case this.actionType.CREATE:
					this.create( _.omit( payload.attrs, [ "id", "_id", "_rev", "actionType" ] ), { wait: true } );

					break;
				case this.actionType.UPDATE:
					this.get( payload.id ).save( _.omit( payload.attrs, [ "id", "actionType" ] ), { wait: true } );

					break;
				case this.actionType.DELETE:
					this.get( payload.id ).destroy();

					break;
			}
		} );
	},

	parse( response ) {
		return Array.from( response.rows, row => row.doc );
	},

	close() {
		this.stopListening( this.dispatcher );
	},
} );

export const getEntity = ( options ) => {
	start();

	const { dispatcher, query, url, url: urlRoot } = options
		, _Collection = Collection.extend( {
			model: Model.extend( {
				urlRoot,
			} ),
			url,
			dispatcher,
		} )
		, collection = new _Collection( null, options );

	return new Promise( ( resolve/*, reject*/ ) => collection.fetch( {
		data: {
			query, // TODO: dynamic query for PouchDB
		},

		success( data ) {
			resolve( {
				data,
				actionType: collection.actionType,
			} );
		},
	} ) );
};

export const getModel = ( { _Model, attrs, callback } ) => {
	const model = new _Model( attrs );

	model.fetch( {
		success( data ) {
			if ( callback ) callback( data );
		},
	} );
};