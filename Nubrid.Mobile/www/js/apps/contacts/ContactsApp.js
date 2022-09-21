define(
["apps/ContactManager"
, "apps/header/HeaderApp"
, "apps/about/AboutApp"]
, function (ContactManager) {
	var ContactsApp = ContactManager.module("ContactsApp");
	ContactsApp.Router = Marionette.AppRouter.extend({
		appRoutes: {
			"contacts(/filter/criterion::criterion)": "listContacts",
			"contacts/:id": "showContact",
			"contacts/:id/edit": "editContact"
		}
	});

	var API = {
		listContacts: function (criterion) {
			require(["apps/contacts/list/ListController"], function () {
				ContactsApp.List.Controller.listContacts(criterion);
				ContactManager.execute("set:active:header", "contacts");
			});
		},

		showContact: function (id) {
			require(["apps/contacts/show/ShowController"], function () {
				ContactsApp.Show.Controller.showContact(id);
				ContactManager.execute("set:active:header", "contacts");
			});
		},

		editContact: function (id) {
			require(["apps/contacts/edit/EditController"], function () {
				ContactsApp.Edit.Controller.editContact(id);
				ContactManager.execute("set:active:header", "contacts");
			});
		}
	};

	ContactManager.on("contacts:list", function () {
		ContactManager.navigate("contacts");
		API.listContacts();
	});

	ContactManager.on("contacts:filter", function (criterion) {
		if (criterion) {
			ContactManager.navigate("contacts/filter/criterion:" + criterion);
		}
		else {
			ContactManager.navigate("contacts");
		}
	});

	ContactManager.on("contact:show", function (id) {
		ContactManager.navigate("contacts/" + id);
		API.showContact(id);
	});

	ContactManager.on("contact:edit", function (id) {
		ContactManager.navigate("contacts/" + id + "/edit");
		API.editContact(id);
	});

	ContactManager.addInitializer(function () {
		new ContactsApp.Router({
			controller: API
		});
	});

	return ContactManager;
});