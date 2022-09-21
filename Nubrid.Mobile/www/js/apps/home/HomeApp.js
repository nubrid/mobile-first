define(["apps/AppManager", "apps/todos/TodosApp"], function (AppManager) {
	var HomeApp = AppManager.module("HomeApp");
	HomeApp.Router = Marionette.AppRouter.extend({
		appRoutes: {
			"": "showHome"
			, "home": "showHome"
		}
	});

	var API = {
		showHome: function () {
			require(["apps/home/show/ShowController"], function () {
				HomeApp.Show.Controller.showHome();
			});
		}
	};

	AppManager.on("home:show", function () {
		AppManager.navigate("home");
		API.showHome();
	});

	AppManager.addInitializer(function () {
		new HomeApp.Router({
			controller: API
		});
	});

	return AppManager;
});