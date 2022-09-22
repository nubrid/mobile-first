/*
Common Controller
*/
import AppManager from "apps/AppManager";
import CommonView from "apps/common/View";
import "apps/common/Dispatcher";
export default Marionette.Object.extend({
	initialize( options ) {
		this.id = options.id;
		this.Layout = CommonView.Layout;
	}
	, show () {
		let page = AppManager.changePage(_.defaults(_.pick(this, "id", "title", "Main", "Layout"), { dispatcher: AppManager.request("dispatcher", this.id) }));
		page.on("all", function (actionType, action) {
			this.options.dispatcher.trigger(actionType, { actionType, action });
		});
	}
});