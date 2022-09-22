/*
Common Controller
*/
define(
["apps/AppManager"
, "apps/common/View"
, "apps/common/Dispatcher"]
, function (AppManager, CommonView) {
	"use strict";
	return Marionette.Object.extend({
		initialize: function (options) {
			this.id = options.id;
			this.Layout = CommonView.Layout;
		}
		, show: function () {
			var page = AppManager.changePage(_.defaults(_.pick(this, "id", "title", "Main", "Layout"), { dispatcher: AppManager.request("dispatcher", this.id) }));
			page.on("all", function (actionType, attrs) {
				this.options.dispatcher.trigger(actionType, { actionType: actionType, attrs: attrs });
			});
		}
	});
});