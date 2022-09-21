define(["apps/AppManager", "text!apps/home/show/Show.html"], function (AppManager, ShowTemplate) {
	var Show = AppManager.module("HomeApp.Show");
	Show.Panel = Marionette.ItemView.extend({
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
				.html(_.template(AppManager.applyMasterPage(ShowTemplate)))
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

	return Show.Panel;
});