define(["apps/ContactManager", "text!apps/about/show/Show.html"], function (ContactManager, ShowTemplate) {
	var Show = ContactManager.module("AboutApp.Show");
	Show.Message = Marionette.ItemView.extend({
		template: _.template(ShowTemplate)
	});
});