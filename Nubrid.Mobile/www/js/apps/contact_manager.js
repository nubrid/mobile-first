define(
	["backbone.marionette"
	, "apps/config/marionette/regions/dialog"
	, "json2"
	, "backbone.picky"
	, "backbone.syphon"
	, "backbone.localstorage"
	, "spin"
	, "spin.jquery"]
, function (Marionette, Dialog) {
	window.ContactManager = new Marionette.Application();

	ContactManager.addRegions({
		headerRegion: "#header-region",
		mainRegion: "#main-region",
		dialogRegion: Dialog.extend({
			el: "#dialog-region"
		})
	});

	ContactManager.navigate = function (route, options) {
		options || (options = {});
		Backbone.history.navigate(route, options);
	};

	ContactManager.getCurrentRoute = function () {
		return Backbone.history.fragment
	};

	ContactManager.on("start", function () {
		if (Backbone.history) {
			Backbone.history.start();

			if (this.getCurrentRoute() === "") {
				ContactManager.trigger("contacts:list");
			}
		}
	});

	return ContactManager;
});