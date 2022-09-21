define(
["apps/ContactManager"
, "apps/header/list/ListController"]
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