define(
["apps/AppManager"
, "apps/todos/list/ListView"
, "entities/Todo"]
, function (AppManager, ListView) {
	var List = AppManager.module("TodosApp.List");
	List.Controller = {
		listTodos: function () {
			window.socket = Primus.connect(AppManager.Url.IO.Root);

			var todosListLayout = AppManager.changePage(ListView);
			var todosListPanel = new List.Panel();

			var fetchingTodos = AppManager.request("todo:entities");

			$.when(fetchingTodos).done(function (todos) {
				var todosListView = new List.Todos({
					collection: todos
				});

				todosListLayout.panelRegion.show(todosListPanel);
				todosListLayout.todosRegion.show(todosListView);

				todosListPanel.on("todo:add", function () {
					// Set noIoBind to true to disable ioBind events as there is no id.
					var todo = AppManager.Entities.Todo.extend({ noIoBind: true });

					var attrs = {
						title: this.ui.txtTodo.val(),
						completed: false
					};

					// Reset the text box value
					this.ui.txtTodo.val("");

					var _todo = new todo(attrs);
					_todo.save();
				});

				todos.each(todo_created);
				todosListView.on("todo:created", todo_created);
				todosListView.on("todo:delete", function (model) {
					model.destroy();
				});

				function todo_created(model) {
					model.bind("change:completed", function () {
						this.save();
					});
				}
			});
		}
	}
});