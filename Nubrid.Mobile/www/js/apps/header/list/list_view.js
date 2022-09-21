define(
["apps/contact_manager"
, "text!apps/header/list/listlink.html"
, "text!apps/header/list/list.html"]
, function (ContactManager, ListLinkTemplate, ListTemplate) {
	var List = ContactManager.module("HeaderApp.List");
	List.Header = Marionette.ItemView.extend({
		template: _.template(ListLinkTemplate),
		tagName: "li",

		events: {
			"click a": "navigate"
		},

		navigate: function (e) {
			e.preventDefault();
			this.trigger("navigate", this.model);
		},

		onRender: function () {
			if (this.model.selected) {
				// add class so Bootstrap will highlight the active entry in the navbar
				this.$el.addClass("active");
			};
		}
	});

	List.Headers = Marionette.CompositeView.extend({
		template: _.template(ListTemplate),
		className: "navbar navbar-inverse navbar-fixed-top",
		childView: List.Header,
		childViewContainer: "ul",

		events: {
			"click a.brand": "brandClicked"
		},

		brandClicked: function (e) {
			e.preventDefault();
			this.trigger("brand:clicked");
		}
	});
});