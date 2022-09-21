/*
Todo List Controller
*/
define(
["apps/AppManager"
, "apps/todos/list/View"
, "entities/Todo"]
, function (AppManager) {
	var List = AppManager.module("TodosApp.List");
	List.Controller = {
		listTodos: function () {
			var self = this;
			this.layout = AppManager.changePage(List.Layout);
			this.form = new List.Form();

			var fetchingTodos = AppManager.request("todo:entities");

			$.when(fetchingTodos).done(function (todos) {
				var todosListView = new List.Todos({
					collection: todos
				});

				self.layout.panelRegion.show(self.form);
				self.layout.todosRegion.show(todosListView);

				self.form.on("todo:add", function () {
					// Set noIoBind to true to disable ioBind events as there is no id.
					var todo = AppManager.Entities.Todo.extend({ noIoBind: true });

					var attrs = {
						title: this.ui.txtTodo.val(),
						completed: false
					};

					// Reset the text box value
					this.ui.txtTodo.val("");

					var _todo = new todo(attrs);

					_todo.socket = AppManager.connect(function () {
						_todo.save({}, {
							success: function (model, response) {
								model.socket.end();
							}
							, error: function (model, response) {
								model.socket.end();
							}
						});
					});
				});

				todos.each(todo_created);
				todosListView.on("todo:created", todo_created);
				todosListView.on("todo:delete", function (model) {
					model.socket = AppManager.connect(function () {
						model.destroy({
							success: function (model, response) {
								model.socket.end();
							}
							, error: function (model, response) {
								model.socket.end();
							}
						});
					});
				});

				function todo_created(model) {
					model.bind("change:completed", function () {
						this.save({}, {
							success: function (model, response) {
								model.socket.end();
							}
							, error: function (model, response) {
								model.socket.end();
							}
						});
					});
				}
			});
		}
	}
});