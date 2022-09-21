define(
["apps/AppManager"
, "text!apps/todos/list/ListLayout.html"
, "text!apps/todos/list/ListPanel.html"
, "text!apps/todos/list/ListItem.html"]
, function (AppManager, ListLayoutTemplate, ListPanelTemplate, ListItemTemplate) {
	var List = AppManager.module("TodosApp.List");
	List.Layout = Marionette.LayoutView.extend({
		regions: {
			panelRegion: "#panel-region",
			todosRegion: "#todos-region"
		}
		, initialize: function () {
			this.render();
		}
		, render: function () {
			this.$el
				.html(_.template(AppManager.applyMasterPage(ListLayoutTemplate)))
				.attr("data-role", "page")
				.attr("id", "todo");
			return this;
		}
	});

	List.Panel = Marionette.ItemView.extend({
		id: "TodoForm"
		, ui: {
			txtTodo: "#txtTodo"
		}
		, triggers: {
			"click #btnAddTodo": "todo:add"
		}
		, initialize: function () {
			this.render();
		}
		, render: function () {
			this.$el.html(_.template(ListPanelTemplate));
			this.bindUIElements();
			return this;
		}
	});

	List.Todos = Marionette.ItemView.extend({
		id: "TodoList"
		, events: {
			"click #btnDeleteTodo": "deleteTodo"
		}
		, render: function () {
			var elManagerFactory = new Backbone.CollectionBinder.ElManagerFactory(ListItemTemplate, "data-name");
			this.collectionBinder = new Backbone.CollectionBinder(elManagerFactory);
			this.collectionBinder.bind(this.collection, this.$el);

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

			this.trigger("todo:delete", model);
		}
	});

	return List.Layout;
});