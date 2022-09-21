define(["apps/AppManager", "text!apps/home/list/List.html"], function (AppManager, ListTemplate) {
	var List = AppManager.module("HomeApp.List");
	List.Panel = Marionette.ItemView.extend({
		ui: {
			txtInput: "#txtInput"
		}
		, events: {
			"click #btnOpenBrowser": "openBrowser"
			, "click .social-media": "login"
		}
		, initialize: function () {
			this.render();
		}
		, render: function () {
			this.$el
				.html(_.template(AppManager.applyMasterPage(ListTemplate)))
				.attr("data-role", "page")
				.attr("id", "home");
			this.bindUIElements();
			return this;
		}
		, openBrowser: function () {
			this.trigger("home:openBrowser");
		}
		, login: function (event) {
			this.trigger("home:login", event);
		}
	});

	return List.Panel;
});