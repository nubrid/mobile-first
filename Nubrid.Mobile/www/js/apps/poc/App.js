/*
Poc App
*/
define(["apps/AppManager"], function (AppManager) {
	var PocApp = AppManager.module("PocApp", AppManager.Common.Module.extend({
		Router: Marionette.AppRouter.extend({
			appRoutes: {
				"poc": "listPoc"
			}
		})
		, onStart: function () {
			$("head").append($("<link rel='stylesheet' type='text/css' />").attr("href", "https://cdnjs.cloudflare.com/ajax/libs/handsontable/0.14.1/handsontable.full.min.css"));
			require(["apps/poc/list/Controller", "jquery.handsontable"], function (controller) { // TODO: , require(["apps/poc/list/Controller", "apps/poc/new/Controller"], function (listController, newController) {
				// TODO: var controller = _.extend(listController, newController);
				new PocApp.Router({
					controller: controller
				});

				controller.start(); // TODO: listController.start();
				// TODO: newController.start();

				switch (AppManager.currentRoute()) {
					case "poc":
						AppManager.trigger("poc:list");
						break;
				}
			});
		}
	}));

	return PocApp;
});