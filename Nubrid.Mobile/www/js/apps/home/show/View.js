/*
Home Show View
*/
define(
["apps/AppManager"
, "text!apps/home/show/Show.html"]
, function (AppManager, ShowTemplate) {
	var Show = AppManager.module("HomeApp.Show");
	Show.Panel = Marionette.ItemView.extend({
		template: _.template(ShowTemplate)
		, attributes: {
            "id": "HomeShowPage"
			, "data-role": "page"
		}
		, ui: {
			txtInput: "#txtInput"
		}
		, triggers: {
			"click #btnOpenBrowser": "home:openBrowser"
			, "click .social-media": "home:login"
		}
	});

	return Show;
});