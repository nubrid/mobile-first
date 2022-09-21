define(
["apps/ContactManager"
, "apps/contacts/common/Views"], function (ContactManager) {
	var New = ContactManager.module("ContactsApp.New");
	New.Contact = ContactManager.ContactsApp.Common.Views.Form.extend({
		title: "New Contact",

		onRender: function () {
			this.$(".js-submit").text("Create contact");
		}
	});
});