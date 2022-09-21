define(
	["text!templates/Home.html"]
	, function (HomeTemplate) {
		App.Views.Home = Backbone.View.extend({
			events: {
				"click #btnOpenBrowser": "openBrowser"
				, "click .social-media": "login"
			}
			, initialize: function () {
				this.render();
			}
			, render: function () {
				this.$el
					.html(_.template(applyMasterPage(HomeTemplate)))
					.attr("data-role", "page")
					.attr("id", "home");
				return this;
			}
			, openBrowser: function () {
				net(function () {
					var ref = window.open($("#txtInput").val(), "_blank", "location=no");

					setTimeout(function () {
						ref.close();
					}, 5000);
				});
			}
			, login: function (event) {
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

				return false;
			}
		});

		return App.Views.Home;
	}
);