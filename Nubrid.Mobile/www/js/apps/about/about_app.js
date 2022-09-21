define(
["apps/contact_manager"
, "apps/about/show/show_controller"]
, function (ContactManager) {
	var AboutApp = ContactManager.module("AboutApp");
	AboutApp.Router = Marionette.AppRouter.extend({
		appRoutes: {
			"about": "showAbout"
		}
	});

	var API = {
		showAbout: function () {
			AboutApp.Show.Controller.showAbout();
			ContactManager.execute("set:active:header", "about");
		}
	};

	ContactManager.on("about:show", function () {
		ContactManager.navigate("about");
		API.showAbout();
	});

	ContactManager.addInitializer(function () {
		new AboutApp.Router({
			controller: API
		});
	});
});