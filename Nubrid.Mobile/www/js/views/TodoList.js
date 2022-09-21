// List of Todos received upon construction.
// This view will respond to events broadcasted from socket.io.
define(["views/TodoListItem"], function (TodoListItem) {
	App.Views.TodoList = Backbone.View.extend({
		id: "TodoList"
		, initialize: function (todos) {
			_.bindAll(this, "render", "addTodo");

			this.todos = todos;

			// Called upon fetch.
			this.todos.bind("reset", this.render);
			// Called when the collection adds a new Todo from the server.
			this.todos.bind("add", this.addTodo);

			this.render();
		}
		, render: function () {
			var self = this;

			this.todos.each(function (todo) {
				self.addTodo(todo);
			});

			return this;
		}
		, addTodo: function (todo) {
			var todoListItem = new TodoListItem(todo);
			this.$el.append(todoListItem.$el);
		}
	});

	return App.Views.TodoList;
});