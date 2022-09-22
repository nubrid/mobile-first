/*
Common Controller
*/
define(
["apps/AppManager"]
, function (AppManager) {
	"use strict";
	return Marionette.Object.extend({
		initialize: function (options) {
			this.id = options.id;
		}
		, show: function () {
			var page = AppManager.changePage({ id: this.id, title: this.title, layout: this.layout, main: this.main });
			page.on("all", function (actionType, attrs) {
				this.dispatcher.trigger(actionType, { actionType: actionType, attrs: attrs });
			});
		}
	});
});