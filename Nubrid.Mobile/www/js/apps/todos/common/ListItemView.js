/*
Todo Common List Item View
*/
define(
["apps/AppManager"]
, function (AppManager) {
	var View = AppManager.module("TodosApp.Common.View");
	View.ListItem = Marionette.ItemView.extend({
		_modelBinder: undefined
		, templateString: "<option value='<%= Value %>'><%= Text %></option>"
		, initialize: function (options) {
			_.bindAll(this);
			this._modelBinder = new Backbone.ModelBinder();
			this.template = this.getTemplate(
				options.value ? options.value : "Value"
				, options.text ? options.text : "Text"
				, options.name ? options.name : "Name");
		}
		, render: function () {
			this.setElement(this.template);
			this._modelBinder.bind(this.model, this.el);
			return this;
		}
		, close: function () {
			this._modelBinder.unbind();
			this.off();
			this.undelegateEvents();
			this.remove();
		}
		, getTemplate: function (value, text, name) {
			return _.template(this.templateString.replace(/Name/g, name).replace(/Value/g, value).replace(/Text/g, text), this.model.attributes)
		}
	});

	View.SelectListItem = View.ListItem.extend({ templateString: "<option value=\"<%= Value %>\"><%= Text %></option>" });
	View.RadioListItem = View.ListItem.extend({ templateString: "<label for=\"<%= Value %>Name\"><input type=\"radio\" name=\"Name\" id=\"<%= Value %>Name\" value=\"<%= Value %>\" /><%= Text %></label>" });
	View.CheckboxListItem = View.ListItem.extend({ templateString: "<label><input type=\"checkbox\" id=\"<%= Value %>Name\" value=\"<%= Value %>\" /><%= Text %></label>" });

	return View;
});