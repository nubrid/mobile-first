define(
["apps/contact_manager"
, "apps/header/list/list_controller"]
, function (ContactManager) {
	var HeaderApp = ContactManager.module("HeaderApp");

	var API = {
		listHeader: function () {
			HeaderApp.List.Controller.listHeader();
		}
	};

	ContactManager.commands.setHandler("set:active:header", function (name) {
		HeaderApp.List.Controller.setActiveHeader(name);
	});

	HeaderApp.on("start", function () {
		API.listHeader();
	});
});