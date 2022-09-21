define([], function () {
	return { init: app_init };

	function app_init() {
		require(["cordova.loader"], function (navigator) {
			$(function () {
				document.addEventListener(Event.DeviceReady, onDeviceReady, false);
			});

			function onDeviceReady() {
				require(["routers/MobileRouter"], function (MobileRouter) {
					this.router = new MobileRouter();
				});
			}
		});
	}
});