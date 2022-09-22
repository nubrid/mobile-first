"use strict";
const _config = require( "../app.config" )
	, _extend = require( "lodash/extend" )
	, _map = require( "lodash/map" )
	, _omit = require( "lodash/omit" )
	, pg = require( "pg" );
export const db = new pg.Client( _config.db );

db.connect();
db.on( "error", error => console.error( "Could not connect to postgres", error ) );
db.on( "notice", notice => console.info( notice ) );

db.create = ( table, data, callback ) => {
	db.query( `INSERT INTO ${table.replace( /[^A-Z0-9]/ig, "_" )} (data) VALUES ($1) RETURNING id, data`, [ JSON.stringify( _omit( data, "id" ) ) ], ( error, result ) => {
		const args = error ? [ null, error ] : [ JSON.stringify( _extend( { id: result.rows[ 0 ].id }, result.rows[ 0 ].data ) ) ];
		callback.apply( this, args );
	} );
};
db.read = ( table, callback ) => {
	db.query( `SELECT * FROM ${table.replace( /[^A-Z0-9]/ig, "_" )} ORDER BY id`, ( error, result ) => {
		const args = error ? [ null, error ] : [ _map( result.rows, row => _extend( { id: row.id }, row.data ) ) ];
		callback.apply( this, args );
	} );
};
db.update = ( table, data, callback ) => {
	db.query( `UPDATE ${table.replace( /[^A-Z0-9]/ig, "_" )} SET data = $1 WHERE id = $2 RETURNING id, data`, [ JSON.stringify( _omit( data, "id" ) ), data.id ], ( error, result ) => {
		const args = error ? [ null, error ] : [ JSON.stringify( _extend( { id: result.rows[ 0 ].id }, result.rows[ 0 ].data ) ) ];
		callback.apply( this, args );
	} );
};
db.delete = ( table, data, callback ) => {
	db.query( `DELETE FROM ${table.replace( /[^A-Z0-9]/ig, "_" )} WHERE id = $1`, [ data.id ], ( error, result ) => {
		const args = error ? [ null, error ] : [ result.rows[ 0 ] ];
		callback.apply( this, args );
	} );
};
// NOTE: node-rest-client
// const { Client } = require( "node-rest-client" );
// export const db = new Client();

// db.create = db.post;
// db.read = db.get;
// db.update = db.put;