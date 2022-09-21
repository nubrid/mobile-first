define(
["apps/ContactManager"
, "common/Views"
, "entities/Contact"
, "apps/contacts/edit/EditView"
, "apps/contacts/show/ShowView"]
, function (ContactManager) {
	var Edit = ContactManager.module("ContactsApp.Edit");
	Edit.Controller = {
		editContact: function (id) {
			var loadingView = new ContactManager.Common.Views.Loading({
				title: "Artificial Loading Delay",
				message: "Data loading is delayed to demonstrate using a loading view."
			});
			ContactManager.mainRegion.show(loadingView);

			var fetchingContact = ContactManager.request("contact:entity", id);
			$.when(fetchingContact).done(function (contact) {
				var view;
				if (contact !== undefined) {
					view = new Edit.Contact({
						model: contact,
						generateTitle: true
					});

					view.on("form:submit", function (data) {
						if (contact.save(data)) {
							ContactManager.trigger("contact:show", contact.get("id"));
						}
						else {
							view.triggerMethod("form:data:invalid", contact.validationError);
						}
					});
				}
				else {
					view = new ContactManager.ContactsApp.Show.MissingContact();
				}

				ContactManager.mainRegion.show(view);
			});
		}
	};
});