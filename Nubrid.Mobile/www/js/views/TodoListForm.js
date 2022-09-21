// The TodoListForm view handles adding new Todo to the server.
// The server then broadcasts the new Todo to all clients.
define(
	["models/Todo"
	, "text!templates/TodoListForm.html"]
	, function (Todo, TodoListForm) {
		App.Views.TodoListForm = Backbone.View.extend({
			id: "TodoForm"
			, events: {
				"click #btnAddTodo": "addTodo"
			}
			, initialize: function (todos) {
				this.todos = todos;
				this.render();
			}
			, render: function () {
				this.$el.html(_.template(TodoListForm));
				return this;
			}
			, addTodo: function () {
				// Set noIoBind to true to disable ioBind events as there is no id.
				var todo = Todo.extend({ noIoBind: true })
					, txtTodo = this.$el.find("#txtTodo");

				var attrs = {
					title: txtTodo.val(),
					completed: false
				};

				// Reset the text box value
				txtTodo.val("");

				var _todo = new todo(attrs);
				_todo.save();
			}
		});

		return App.Views.TodoListForm;
	}
);