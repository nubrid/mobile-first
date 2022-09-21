/*
Todos List Controller
*/
define(
["apps/AppManager"
, "apps/common/View"
, "apps/todos/list/View"]
, function (AppManager, CommonView, ListView) {
	var _dispatcher = AppManager.TodosApp.dispatcher;
	var Controller = AppManager.module("TodosApp.List.Controller", AppManager.Common.Module.extend({
		listTodos: function () {
			var page = AppManager.changePage({ id: "todos", title: "Todos List", layout: CommonView.Layout, main: ListView.Todos });
			page.on("all", function (eventName, attrs) {
				_dispatcher.trigger(eventName, { actionType: eventName, attrs: attrs });
			});

			//var fetchingTodos = AppManager.request("todo:entities");
			//$.when(fetchingTodos).done(function (todos) {
			//	page.on("todo:add", function (attrs) {
			//		todos.create(attrs, { wait: true });
			//	});

			//	page.on("todo:edit", function (attrs) {
			//		todos.get(attrs.id).save(attrs);
			//	});

			//	page.on("todo:delete", function (attrs) {
			//		todos.get(attrs.id).destroy();
			//	});
			//});
		}
		, onStart: function () {
			AppManager.on("todos:list", this.listTodos);
		}
	}));

	return Controller;
});