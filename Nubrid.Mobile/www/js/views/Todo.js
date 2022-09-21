define(
	["text!templates/Todo.html"
	, "collections/Todos"
	, "views/TodoListForm"
	, "views/TodoList"]
	, function (TodoTemplate, Todos, TodoListForm, TodoList) {
		App.Views.Todo = Backbone.View.extend({
			initialize: function () {
				this.render();
			}
			, render: function () {
				this.$el
					.html(_.template(applyMasterPage(TodoTemplate)))
				    .attr("data-role", "page")
					.attr("id", "todo");

				window.socket = io.connect(Url.IO.Root);

				// Create new Todos collection then pass it to the form and list views.
				// Append the views to the page.
				var todos = new Todos();

				var form = new TodoListForm(todos);
				var list = new TodoList(todos);

				this.$el.find("#TodoWrapper")
					.append(form.$el)
					.append(list.$el);

				todos.fetch();

				return this;
			}
		});

		return App.Views.Todo;
	}
);