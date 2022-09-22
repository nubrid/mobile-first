require(["main.config"], function () {
	"use strict";
	require(["jquery"], function () {
		$(document).on("mobileinit", function () {
			$.support.cors = true;
			$.mobile.allowCrossDomainPages = true;

			// Use Backbone routing
			$.mobile.autoInitializePage = false;
			$.mobile.linkBindingEnabled = false;
			$.mobile.hashListeningEnabled = false;
			$.mobile.pushStateEnabled = false;

			$.mobile.keepNative = "a,button,input";
		});

		require(["jquery.mobile", "modernizr"], function () {
			require(["apps/AppManager"], function (app) {
				app.start();
			});
		});
	});
});