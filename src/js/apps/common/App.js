/*
Common App
*/
define([], function () {
	"use strict";
	function _getControllerPaths(views, name) {
		var paths = [];
		_.each(views, function (view, index) {
			paths[index] = "apps/" + name + "/" + view + "/Controller";
		});

		return paths;
	}

	return {
		views: ["show"]
		, start: function (moduleName) {
			require(_getControllerPaths(this.views, moduleName), $.proxy(function () {
				_.each(arguments, $.proxy(function (Controller, index) {
					var viewName = this.views[index];
					var appRoutes = {};

					if (moduleName === "home") _.extend(appRoutes, { "": this.views[0] });
					appRoutes[moduleName] = viewName;
					
					var controller = new Controller({ id: moduleName });

					/* jshint nonew: false */
					new Marionette.AppRouter({
						appRoutes: appRoutes
						, controller: controller
					});

					controller.show();
				}, this));
			}, this));
		}
	};
});