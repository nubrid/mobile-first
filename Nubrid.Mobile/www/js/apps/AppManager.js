define(["backbone.marionette", "text!templates/MasterPage.html"], function (Marionette, MasterPage) {
	window.AppManager = new Marionette.Application();

	AppManager.Url = {
		IO: { Root: "http://socket.nubrid.com" }
		, Web: "http://www.nubrid.com"
	};

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
			else {
				require(["cordova.loader"], function (navigator) {
					$(function () {
						document.addEventListener("deviceready", start, false);
					});
				});
			}

			function start() {
				if (Backbone.history) {
					$(".back").on("click", function (event) {
						window.history.back();
						return false;
					});

					AppManager.applyMasterPage(null, MasterPage);

					Backbone.history.start();

					if (AppManager.getCurrentRoute() === "") {
						AppManager.trigger("home:show");
					}
				}
			}
		});
	});

	return AppManager;
});