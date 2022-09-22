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
		, start: function () {
			require(_getControllerPaths(this.views, this.moduleName), $.proxy(function () {
				_.each(arguments, $.proxy(function (controller, index) {
					var viewName = this.views[index];
					var appRoutes = {};

					if (this.moduleName === "home") appRoutes = _.extend(appRoutes, { "": this.views[0] });
					appRoutes[this.moduleName] = viewName;

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