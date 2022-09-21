define(
["apps/ContactManager"
, "apps/contacts/common/Views"]
, function (ContactManager) {
	var Edit = ContactManager.module("ContactsApp.Edit");
	Edit.Contact = ContactManager.ContactsApp.Common.Views.Form.extend({
		initialize: function () {
			this.title = "Edit " + this.model.get("firstName") + " " + this.model.get("lastName");
		},

		onRender: function () {
			if (this.options.generateTitle) {
				var $title = $('<h1>', { text: this.title });
				this.$el.prepend($title);
			}

			this.$(".js-submit").text("Update contact");
		}
	});
});