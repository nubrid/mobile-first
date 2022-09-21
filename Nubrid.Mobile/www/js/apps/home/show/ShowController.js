define(
["apps/AppManager"
, "apps/home/show/ShowView"]
, function (AppManager, ShowView) {
	var Show = AppManager.module("HomeApp.Show");
	Show.Controller = {
		showHome: function () {
			show = AppManager.changePage(ShowView, true);
			show.on("home:openBrowser", function () {
				net(function () {
					var ref = window.open(show.ui.txtInput.val(), "_blank", "location=no");

					setTimeout(function () {
						ref.close();
					}, 5000);
				});
			});
			show.on("home:login", function (event) {
				var provider = $(event.target).attr("href").substring(1);

				net(function () {
					var loginWindow = window.open(AppManager.Url.Web + "/auth/" + provider, "_blank", "location=no");

					loginWindow.addEventListener("loadstop", function (event) {
						if (event.url.indexOf(AppManager.Url.Web) == 0) {
							if (event.url.indexOf(AppManager.Url.Web + "/#failed") == 0) {
								alert("Login failed!");
							}
							else if (event.url.indexOf(AppManager.Url.Web + "/") == 0) {
								alert("Login succeeded! See console for profile.");
							}

							loginWindow.close();
						}
					});
				});

				event.preventDefault();
				return false;
			});
		}
	}
});