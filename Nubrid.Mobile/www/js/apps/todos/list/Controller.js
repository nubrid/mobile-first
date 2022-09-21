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
					// Set noIoBind to true to disable ioBind events as there is no id.
					var todo = AppManager.Entities.Todo.extend({ noIoBind: true });

					var _todo = new todo(attrs);
					AppManager.toggleLoading("show");
					_todo.socket = AppManager.connect(function () {
						_todo.save({}, {
							success: function (model, response) {
								model.socket.end();
								AppManager.toggleLoading("hide");
							}
							, error: function (model, response) {
								model.socket.end();
								AppManager.toggleLoading("hide");
							}
						});
					});
				});

				page.on("todo:edit", function (model) {
					model.save();
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