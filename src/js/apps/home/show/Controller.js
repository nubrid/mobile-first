/*
Home Show Controller
*/
define(
["apps/AppManager"
, "apps/common/View"
, "apps/home/show/View"]
, function (AppManager, CommonView, ShowView) {
	"use strict";
	return Marionette.Object.extend({
		initialize: function (options) {
			this.id = options.id;
		}
		, show: function () {
			var page = AppManager.changePage({id: this.id,  title: "Home", layout: CommonView.Layout, main: ShowView.Content, reverse: true });

			page.on("home:openBrowser", function (value) {
				AppManager.net(function () {
					var ref = window.open(value, "_blank", "location=no");

					setTimeout(function () {
						ref.close();
					}, 5000);
				});
			});

			page.on("home:login", function (event) {
				var provider = $(event.target).attr("href").substring(1);

				AppManager.net(function () {
					// TODO: AppManager.popup({ popup: CommonView.IFrame, src: "http://www.nubrid.com", width: 400, height: 300 });
                    var loginWindow = window.open(AppManager.Config.Url.Web + "/auth/" + provider, "_blank", "location=no");

					loginWindow.addEventListener("loadstop", function (event) {
						if (event.url.indexOf(AppManager.Config.Url.Web) === 0) {
							if (event.url.indexOf(AppManager.Config.Url.Web + "/#failed") === 0) {
								alert("Login failed!");
							}
							else if (event.url.indexOf(AppManager.Config.Url.Web + "/") === 0) {
								alert("Login succeeded! See console for profile.");
							}

							loginWindow.close();
						}
					});
				});

				event.preventDefault();
				return false;
			});

			AppManager.navigate("home", { replace: true });
		}
	});
});