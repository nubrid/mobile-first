define(
	["text!templates/MasterPage.html"]
	, function (MasterPage) {
		var MobileRouter = Backbone.Router.extend({
			pages: {}
			, initialize: function () {
				$(".back").on("click", function (event) {
					window.history.back();
					return false;
				});

				applyMasterPage(null, MasterPage);

				Backbone.history.start();
			}
			, routes: {
				"": "home"
				, "home": "home"
				, "todo": "todo"
			}
			, home: function () {
				this.changePage("views/Home", true);
			}
			, todo: function () {
				this.changePage("views/Todo");
			}
			, changePage: function (viewName, isReverse) {
				if (!this.pages[viewName]) {
					var self = this;
					require([viewName], function (view) {
						page = new view();
						$("body").append(page.$el);
						$.mobile.initializePage();

						$("body").pagecontainer("change", page.$el, { reverse: isReverse, transition: "slide" });

						self.pages[viewName] = page;
					});
				}
				else {
					$("body").pagecontainer("change", this.pages[viewName].$el, { reverse: isReverse, transition: "slide" });
				}
			}
		});

		return MobileRouter;
	}
);

function applyMasterPage(page, masterPage) {
	if (masterPage) this._masterPage = masterPage;

	if (!page) return;

	return this._masterPage.replace("<!-- MainContent -->", page);
}