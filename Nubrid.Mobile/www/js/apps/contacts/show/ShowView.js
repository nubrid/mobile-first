define(
["apps/ContactManager"
, "text!apps/contacts/show/ShowMissing.html"
, "text!apps/contacts/show/Show.html"]
, function (ContactManager, ShowMissingTemplate, ShowTemplate) {
	var Show = ContactManager.module("ContactsApp.Show");
	Show.MissingContact = Marionette.ItemView.extend({
		template: _.template(ShowMissingTemplate)
	});

	Show.Contact = Marionette.ItemView.extend({
		template: _.template(ShowTemplate),

		events: {
			"click a.js-edit": "editClicked"
		},

		editClicked: function (e) {
			e.preventDefault();
			this.trigger("contact:edit", this.model);
		}
	});
});