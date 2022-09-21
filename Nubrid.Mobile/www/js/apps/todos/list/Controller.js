/*
Todos List Controller
*/
define(
["apps/AppManager"
, "apps/common/View"
, "apps/todos/list/View"
, "entities/Todo"]
, function (AppManager, CommonView, ListView) {
	var Controller = AppManager.module("TodosApp.List.Controller", AppManager.CommonModule.extend({
		listTodos: function () {
			var fetchingTodos = AppManager.request("todo:entities");
			$.when(fetchingTodos).done(function (todos) {
				var page = AppManager.changePage({ id: "todos", title: "Todos List", layout: CommonView.Layout, main: ListView.Todos, collection: todos });

				page.on("todo:add", function (attrs) {
					todos.create(attrs, { wait: true });
				});

				page.on("todo:edit", function (attrs) {
					todos.get(attrs.id).save(attrs);
				});

				page.on("todo:delete", function (model) {
					model.destroy();
				});
			});
		}
		, onStart: function () {
			AppManager.on("todos:list", this.listTodos);
		}
	}));

	return Controller;
});