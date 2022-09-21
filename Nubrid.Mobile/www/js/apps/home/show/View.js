/*
Home Show View
*/
define(["apps/AppManager", "text!apps/home/show/Show.html"], function (AppManager, ShowTemplate) {
	var Show = AppManager.module("HomeApp.Show");
	Show.Panel = Marionette.ItemView.extend({
		template: _.template(AppManager.applyMasterPage({ main: ShowTemplate }))
		, id: "home"
		, attributes: {
			"data-role": "page"
		}
		, ui: {
			txtInput: "#txtInput"
		}
		, events: {
			"click #btnOpenBrowser": "openBrowser"
			, "click .social-media": "login"
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