/*
Todo Common View
*/
define(
["apps/AppManager"
, "text!apps/todos/common/Layout.html"
, "text!apps/todos/common/Form.html"
, "text!apps/todos/common/Item.html"]
, function (AppManager, LayoutTemplate, FormTemplate, ItemTemplate) {
	var View = AppManager.module("TodosApp.Common.View");
	View.Layout = Marionette.LayoutView.extend({
		template: _.template(AppManager.applyMasterPage({ main: LayoutTemplate }))
		, id: "Todo"
		, attributes: {
			"data-role": "page"
		}
		, regions: {
			panelRegion: "#PanelRegion"
			, todosRegion: "#TodosRegion"
		}
	});

	View.Form = Marionette.ItemView.extend({
		template: _.template(FormTemplate)
		, id: "TodoForm"
		, ui: {
			txtTodo: "#txtTodo"
		}
		, triggers: {
			"click #btnAddTodo": "todo:add"
		}
		, onFormDataInvalid: function (errors) {
			var $view = this.$el;

			var clearFormErrors = function () {
				var $form = $view.find("form");
				$form.find(".help-inline.error").each(function () {
					$(this).remove();
				});
				$form.find(".control-group.error").each(function () {
					$(this).removeClass("error");
				});
			}

			var markErrors = function (value, key) {
				var $controlGroup = $view.find("#contact-" + key).parent();
				var $errorEl = $("<span>", { class: "help-inline error", text: value });
				$controlGroup.append($errorEl).addClass("error");
			}

			clearFormErrors();
			_.each(errors, markErrors);
		}
	});

	View.Todos = Marionette.ItemView.extend({
		id: "TodoList"
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
			});
			return this;
		}
		, deleteTodo: function (event) {
			var el = $(event.target)[0];
			var model = this.collectionBinder.getManagerForEl(el).getModel();

			this.trigger("todo:delete", model);
		}
	});

	return View;
});