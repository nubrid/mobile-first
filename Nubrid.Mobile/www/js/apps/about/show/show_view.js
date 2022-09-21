define(["apps/contact_manager", "text!apps/about/show/show.html"], function (ContactManager, ShowTemplate) {
	var Show = ContactManager.module("AboutApp.Show");
	Show.Message = Marionette.ItemView.extend({
		template: _.template(ShowTemplate)
	});
});