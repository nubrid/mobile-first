// The TodoListItem view is created for each Todo in the list.
// It responds to client interaction and handles displying changes to Todo model received from the server.
// Receives a model on construction and binds to change events for whether the Todo is completed or not.
define(["text!templates/TodoListItem.html"], function (TodoListItem) {
	App.Views.TodoListItem = Backbone.View.extend({
		className: "todo"
		, events: {
			"click #chkCompleteTodo": "completeTodo",
			"click #btnDeleteTodo": "deleteTodo"
		}
		, initialize: function (model) {
			_.bindAll(this, "setStatus", "removeTodo");

			this.model = model;

			this.model.bind("change:completed", this.setStatus);
			// Called when the model is told to remove a todo.
			this.model.bind("remove", this.removeTodo);

			this.render();
		}
		, render: function () {
			this.$el
				.html(_.template(TodoListItem, this.model.toJSON()))
				.attr("id", this.model.id);
			this.setStatus();
			return this;
		}
		, setStatus: function () {
			var chkCompleteTodo = this.$el.find("#chkCompleteTodo");
			chkCompleteTodo.attr("checked", this.model.get("completed"));
		}
		, completeTodo: function () {
			// Toggle completed flag.
			// Wait for the server to instruct us to set status (update UI).
			var status = this.model.get("completed");
			this.model.save({ completed: !!!status });
		}
		, deleteTodo: function () {
			// silent set to true to react to the server broadcasting the remove event.
			this.model.destroy({ silent: true });
		}
		, removeTodo: function (todo) {
			var self = this
				, width = this.$el.outerWidth();

			this.$el
				.css("width", width + "px")
				.animate(
					{ "margin-left": width, "opacity": 0 }
					, 200
					, function () {
						self.$el.animate(
							{ "height": 0 }
							, 200
							, function () {
								self.$el.remove();
							});
					});
		}
	});

	return App.Views.TodoListItem;
});