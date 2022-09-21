/*
Todos List View
*/
define(
["apps/AppManager"
, "text!apps/todos/list/Layout.html"
, "text!apps/todos/list/Panel.html"
, "text!apps/todos/list/Item.html"]
, function (AppManager, LayoutTemplate, PanelTemplate, ItemTemplate) {
	var List = AppManager.module("TodosApp.List");
	List.Layout = Marionette.LayoutView.extend({
	    template: _.template(LayoutTemplate)
		, attributes: {
            "id": "TodosListPage"
		    , "data-role": "page"
		}
		, regions: {
		    PanelRegion: "#TodosListPanelRegion"
            , TodosRegion: "#TodosListRegion"
		}
	});

	List.Panel = Marionette.ItemView.extend({
	    template: _.template(PanelTemplate)
	    , id: "TodosListPanel"
		, ui: {
			txtTodo: "#txtTodo"
		}
		, triggers: {
			"click #btnAddTodo": "todo:add"
		}
	});

	List.Todos = Marionette.ItemView.extend({
		id: "TodosList"
		, events: {
			"click #btnDeleteTodo": "deleteTodo"
		}
		, render: function () {
			var self = this;
			var elManagerFactory = new Backbone.CollectionBinder.ElManagerFactory(ItemTemplate, "data-name");
			this.collectionBinder = new Backbone.CollectionBinder(elManagerFactory);
			this.collectionBinder.bind(this.collection, this.$el);

			this.collectionBinder.on("elCreated", function (model, el) {
			    self.trigger("todo:created", model);
			    self.$el.enhanceWithin();
			});
			return this;
		}
		, deleteTodo: function (event) {
			var el = $(event.target)[0];
			var model = this.collectionBinder.getManagerForEl(el).getModel();

			this.trigger("todo:delete", model);
		}
	});

	return List;
});