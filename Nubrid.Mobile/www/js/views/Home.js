define(
	["text!templates/Home.html"]
	, function (HomeTemplate) {
		App.Views.Home = Backbone.View.extend({
			events: {
				"click #btnOpenBrowser": "openBrowser"
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
		});

		return App.Views.Home;
	}
);