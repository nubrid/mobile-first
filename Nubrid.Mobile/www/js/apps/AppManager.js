define(["backbone.marionette", "text!templates/MasterPage.html"], function (Marionette, MasterPage) {
	window.AppManager = new Marionette.Application();

	AppManager.addRegions({
		mainRegion: "body"
	});

	AppManager.navigate = function (route, options) {
		options || (options = {});
		Backbone.history.navigate(route, options);
	};

	AppManager.getCurrentRoute = function () {
		return Backbone.history.fragment
	};

	AppManager.applyMasterPage = function (page, masterPage) {
		if (masterPage) AppManager._masterPage = masterPage;

		if (!page) return;

		return AppManager._masterPage.replace("<!-- MainContent -->", page);
	}

	AppManager.changePage = function (view, isReverse) {
		page = new view();
		AppManager.mainRegion.show(page);
		$.mobile.initializePage();

		$("body").pagecontainer("change", page.$el, { reverse: isReverse, transition: "slide" });

		return page;
	}

	AppManager.on("start", function () {
		require(["detectmobilebrowser"], function () {
			if (!window.mobile) {
				start();
			}

			require(["cordova.loader"], function (navigator) {
				$(function () {
					document.addEventListener(Event.DeviceReady, start, false);
				});
			});

			function start() {
				if (Backbone.history) {
					$(".back").on("click", function (event) {
						window.history.back();
						return false;
					});

					AppManager.applyMasterPage(null, MasterPage);

					Backbone.history.start();

					if (this.getCurrentRoute() === "") {
						AppManager.trigger("home:list");
					}
				}
			}
		});
	});

	return AppManager;
});