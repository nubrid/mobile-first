define(
["apps/AppManager"
, "apps/home/list/ListView"]
, function (AppManager, ListView) {
	var List = AppManager.module("HomeApp.List");
	List.Controller = {
		listHome: function () {
			list = AppManager.changePage(ListView, true);
			list.on("home:openBrowser", function () {
				net(function () {
					var ref = window.open(list.ui.txtInput.val(), "_blank", "location=no");

					setTimeout(function () {
						ref.close();
					}, 5000);
				});
			});
			list.on("home:login", function (event) {
				var provider = $(event.target).attr("href").substring(1);

				net(function () {
					var loginWindow = window.open(Url.Web + "/auth/" + provider, "_blank", "location=no");

					loginWindow.addEventListener("loadstop", function (event) {
						if (event.url.indexOf(Url.Web) == 0) {
							if (event.url.indexOf(Url.Web + "/#failed") == 0) {
								alert("Login failed!");
							}
							else if (event.url.indexOf(Url.Web + "/") == 0) {
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