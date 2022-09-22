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
		});

		require(["backbone.iobind", "jquery.mobile", "modernizr"], function () {
			require(["app"], function (app) {
				app.start();
			});
		});
	});
});