define(["apps/contacts/contacts_app"], function (ContactManager) {
	return ContactManager;

	//return { init: app_init };

	//function app_init() {
	//	require(["detectmobilebrowser"], function () {
	//		if (!window.mobile) {
	//			start();
	//		}

	//		require(["cordova.loader"], function (navigator) {
	//			$(function () {
	//				document.addEventListener(Event.DeviceReady, start, false);
	//			});
	//		});

	//		function start() {
	//			require(["routers/MobileRouter"], function (MobileRouter) {
	//				this.router = new MobileRouter();
	//			});
	//		}
	//	});
	//}
});