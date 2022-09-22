/*
Home Show Controller
*/
define(
["apps/AppManager"
, "apps/common/Controller"
, "apps/common/View"
, "apps/home/show/View"]
, function (AppManager, CommonController, CommonView, ShowView) {
	"use strict";
	return CommonController.extend({
		title: "Home"
		, Main: ShowView.Content
		, show: function () {
			var page = AppManager.changePage(_.pick(this, "id", "title", "Main", "Layout")); //, reverse: true });

			page.on("home:openBrowser", function (value) {
				AppManager.net(function () {
					AppManager.popup({ popup: CommonView.IFrame, src: value, width: 400, height: 300 });
					// TODO: var ref = window.open(value, "_blank", "location=no");

					// setTimeout(function () {
					// 	ref.close();
					// }, 5000);
				});
			});

			page.on("home:login", function (event) {
				var provider = $(event.target).attr("href").substring(1);

				AppManager.net(function () {
                    var loginWindow = window.open(window.url + "/auth/" + provider, "_blank", "location=no");

					loginWindow.addEventListener("loadstop", function (event) {
						if (event.url.indexOf(window.url) === 0) {
							if (event.url.indexOf(window.url + "/#failed") === 0) {
								alert("Login failed!");
							}
							else if (event.url.indexOf(window.url + "/") === 0) {
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