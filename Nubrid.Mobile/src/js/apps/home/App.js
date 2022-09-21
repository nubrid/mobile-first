/*
Home App
*/
define(["apps/AppManager"], function (AppManager) {
	"use strict";
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
				/* jshint nonew: false */
				new HomeApp.Router({
					controller: controller
				});

				controller.start(); // TODO: showController.start();
				// TODO: newController.start();

				var currentRoute = AppManager.currentRoute() ? AppManager.currentRoute() : "home";
				AppManager.trigger(currentRoute + ":show");
				AppManager.navigate(currentRoute);
			});
		}
	}));

	return HomeApp;
});