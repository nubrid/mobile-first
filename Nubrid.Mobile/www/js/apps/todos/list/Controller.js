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
            var list = AppManager.changePage({ url: "todos", layout: CommonView.Layout, main: ListView.Layout });

            var fetchingTodos = AppManager.request("todo:entities");
            $.when(fetchingTodos).done(function (todos) {
                var todosListPanel = new ListView.Panel();
                var todosList = new ListView.Todos({
                    collection: todos
                });

                list.PanelRegion.show(todosListPanel);
                list.TodosRegion.show(todosList);

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

                todos.each(todo_created);
                todosList.on("todo:created", todo_created);
                todosList.on("todo:delete", function (model) {
                    model.destroy();
                });

                function todo_created(model) {
                    model.bind("change:completed", function () {
                        this.save();
                    });
                }
            });
        }
		, onStart: function () {
		    AppManager.on("todos:list", this.listTodos);
		}
    }));

    return Controller;
});