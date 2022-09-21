/*
Common App
*/
define(["apps/AppManager"], function (AppManager) {
	"use strict";
	function _getControllerPaths(views, name) {
		var paths = [];
		_.each(views, function (view, index) {
			paths[index] = "apps/" + name + "/" + view + "/Controller";
		});

		return paths;
	}

	var Common = AppManager.module("Common");
	Common.App = AppManager.module("Common.Module").extend({
		views: ["show"]
		, onStart: function () {
			var appName = this.moduleName.toLowerCase();
			require(_getControllerPaths(this.views, appName), $.proxy(function () {
				var controller = {};
				_.each(arguments, $.proxy(function (value, index) {
					//if (value.start) {
					//	var viewName = this.views[index];
					//	var newController = value.start("App." + this.moduleName + "." + viewName.charAt(0).toUpperCase() + viewName.substring(1));
					//	controller = _.extend(controller, _.pick(newController, viewName));
					//}
					var viewName = this.views[index];
					var newController = AppManager.getModule(this.moduleName + "." + viewName.charAt(0).toUpperCase() + viewName.substring(1), value);
					controller = _.extend(controller, _.pick(newController, viewName));
				}, this));
				var appRoutes = {};
				if (appName === "home") appRoutes = _.extend(appRoutes, { "": this.views[0] });
				_.each(this.views, function (view) {
					appRoutes[appName] = view;
				});

				/* jshint nonew: false */
				var router = new Marionette.AppRouter({
					appRoutes: appRoutes
					, controller: controller
				});

				//if (arguments[0] && arguments[0].start) {
				//	arguments[0].start();
				//}

				AppManager.navigate(AppManager.currentRoute() || "home");
			}, this));
		}
	});

	return Common.App;
});