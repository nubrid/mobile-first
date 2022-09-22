"use strict";
import {
	GraphQLBoolean,
	// GraphQLFloat,
	// GraphQLID,
	GraphQLInt,
	GraphQLList,
	// GraphQLNonNull,
	GraphQLObjectType,
	GraphQLSchema,
	GraphQLString
} from "graphql";

import { db } from "./database";

const _todo = new GraphQLObjectType( {
	name: "Todo"
	, description: "Todo item"
	, fields: () => ( {
		id: {
			type: GraphQLInt
		}
		, title: {
			type: GraphQLString
		}
		, completed: {
			type: GraphQLBoolean
		}
	} )
} );

const _resolve = ( { args }, fieldArgs, args3, ast ) => {
	return new Promise( ( resolve, reject ) => {
		// NOTE: node-rest-client
		// args.push( data => resolve( ast.operation.operation === "mutation" ? data : JSON.parse( data ) ) );
		args.push( ( data, error ) => error ? reject( error ) : resolve( data ) );

		db[ ast.operation.operation === "mutation" ? ast.fieldName : "read" ]
			.apply( this, args );
	} );
};

const query = new GraphQLObjectType( {
	name: "Query"
	, fields: () => ( {
		todos: {
			type: new GraphQLList( _todo )
			, resolve: _resolve
		}
	} )
} );

const mutation = new GraphQLObjectType( {
	name: "Mutation"
	, fields: () => ( {
		create: {
			type: GraphQLString
			, resolve: _resolve
		}
		, update: {
			type: GraphQLString
			, resolve: _resolve
		}
		, delete: {
			type: GraphQLString
			, resolve: _resolve
		}
	} )
} );

module.exports = new GraphQLSchema( {
	query
	, mutation
} );