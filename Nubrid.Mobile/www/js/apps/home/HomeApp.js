define(["apps/AppManager", "apps/todos/TodosApp"], function (AppManager) {
	var HomeApp = AppManager.module("HomeApp");
	HomeApp.Router = Marionette.AppRouter.extend({
		appRoutes: {
			"": "listHome"
			, "home": "listHome"
		}
	});

	var API = {
		listHome: function () {
			require(["apps/home/list/ListController"], function () {
				HomeApp.List.Controller.listHome();
			});
		}
	};

	AppManager.on("home:list", function () {
		AppManager.navigate("home");
		API.listHome();
	});

	AppManager.addInitializer(function () {
		new HomeApp.Router({
			controller: API
		});
	});

	return AppManager;
});