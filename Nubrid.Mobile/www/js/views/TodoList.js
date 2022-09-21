// List of Todos received upon construction.
// This view will respond to events broadcasted from socket.io.
define(["text!templates/TodoListItem.html"], function (TodoListItem) {
	App.Views.TodoList = Backbone.View.extend({
		id: "TodoList"
		, events: {
			"click #btnDeleteTodo": "deleteTodo"
		}
		, initialize: function (todos) {
			this.todos = todos;

			this.render();
		}
		, render: function () {
			var elManagerFactory = new Backbone.CollectionBinder.ElManagerFactory(TodoListItem, "data-name");
			this.collectionBinder = new Backbone.CollectionBinder(elManagerFactory);
			this.collectionBinder.bind(this.todos, this.$el);

			this.collectionBinder.on("elCreated", function (model, el) {
				model.bind("change:completed", function () {
					this.save();
				});
			});

			return this;
		}
		, deleteTodo: function (event) {
			var el = $(event.target)[0];
			var model = this.collectionBinder.getManagerForEl(el).getModel();
			model.destroy();
		}
	});

	return App.Views.TodoList;
});