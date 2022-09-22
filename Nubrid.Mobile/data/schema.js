import {
	GraphQLBoolean,
	GraphQLFloat,
	GraphQLID,
	GraphQLInt,
	GraphQLList,
	GraphQLNonNull,
	GraphQLObjectType,
	GraphQLSchema,
	GraphQLString
} from "graphql";

import { db } from "./database.js";

const Todo = new GraphQLObjectType({
	name: "Todo"
	, description: "Todo item"
	, fields: () => ({
		id: {
			type: GraphQLInt
		}
		, title: {
			type: GraphQLString
		}
		, completed: {
			type: GraphQLBoolean
		}
	})
});

const Operation = {
	CREATE: "create"
	, READ: "read"
	, UPDATE: "update"
	, DELETE: "delete"
};

let _resolve = ({args}, fieldArgs, ast) => {
	return new Promise((resolve, reject) => {
		args.push(data => resolve(ast.operation.operation === "mutation" ? data : JSON.parse(data)));
		
		db[ast.operation.operation === "mutation" ? ast.fieldName : "get"]
			.apply(this, args)
			.on("error", error => reject(error));
	});
};

const Query = new GraphQLObjectType({
	name: "Query"
	, fields: () => ({
		todos: {
			type: new GraphQLList(Todo)
			, resolve: _resolve
		}
	})
});

const Mutation = new GraphQLObjectType({
	name: "Mutation"
	, fields: () => ({
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
	})
});

module.exports = new GraphQLSchema({
	query: Query
	, mutation: Mutation
});