define(
["apps/AppManager"
, "entities/Common"]
, function (AppManager) {
	var Entities = AppManager.module("Entities");
	Entities.Todo = Entities.Common.Model.extend({
		urlRoot: "todo"
		, noIoBind: false
	});

	Entities.Todos = Entities.Common.Collection.extend({
		model: Entities.Todo
		, url: "todos"
		, noIoBind: false
	});

	AppManager.reqres.setHandler("todo:entities", function () {
		return Entities.Common.API.getCollection(AppManager.Entities.Todos);
	});
});