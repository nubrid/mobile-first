define(
["apps/AppManager"
, "entities/Common"]
, function (AppManager, Common) {
	"use strict";
	var Entities = {};
	Entities.Todo = Common.Model.extend({
		//urlRoot: "todo"
		//, noIoBind: false
	});

	Entities.Todos = Common.Collection.extend({
		model: Entities.Todo
		//, url: "todos"
		//, noIoBind: false
	});
});