/*
Home App
*/
define(["apps/AppManager"], function (AppManager) {
	var HomeApp = AppManager.module("HomeApp", AppManager.Common.Module.extend({
		Router: Marionette.AppRouter.extend({
			appRoutes: {
				"": "showHome"
				, "home": "showHome"
			}
		})
		, onStart: function () {
			require(["apps/home/show/Controller"], function (controller) { // TODO: , require(["apps/home/show/Controller", "apps/home/new/Controller"], function (showController, newController) {
				// TODO: var controller = _.extend(showController, newController);
				new HomeApp.Router({
					controller: controller
				});

				controller.start(); // TODO: showController.start();
				// TODO: newController.start();

				switch (AppManager.currentRoute()) {
					case "":
					case "home":
						AppManager.trigger("home:show");
						AppManager.navigate("home");
						break;
				}
			});
		}
	}));

	return HomeApp;
});