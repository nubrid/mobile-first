define(
["apps/ContactManager"
, "common/Views"
, "entities/Contact"
, "apps/contacts/edit/EditView"
, "apps/contacts/show/ShowView"]
, function (ContactManager) {
	var Show = ContactManager.module("ContactsApp.Show");
	Show.Controller = {
		showContact: function (id) {
			var loadingView = new ContactManager.Common.Views.Loading({
				title: "Artificial Loading Delay",
				message: "Data loading is delayed to demonstrate using a loading view."
			});
			ContactManager.mainRegion.show(loadingView);

			var fetchingContact = ContactManager.request("contact:entity", id);
			$.when(fetchingContact).done(function (contact) {
				var contactView;
				if (contact !== undefined) {
					contactView = new Show.Contact({
						model: contact
					});

					contactView.on("contact:edit", function (contact) {
						ContactManager.trigger("contact:edit", contact.get("id"));
					});
				}
				else {
					contactView = new Show.MissingContact();
				}

				ContactManager.mainRegion.show(contactView);
			});
		}
	}
});