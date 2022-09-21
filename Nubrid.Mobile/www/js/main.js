window.host = "//" + document.location.host;
window.protocol = document.location.protocol;
require.config({
	urlArgs: "bust=" + (+new Date) // TODO: For PROD, replace with: urlArgs: "bust=v5.0.x"
	, baseUrl: "js"
	, paths: {
		"backbone": window.protocol + "//cdnjs.cloudflare.com/ajax/libs/backbone.js/1.1.2/backbone-min"
		, "backbone.collectionbinder": window.protocol + "//cdnjs.cloudflare.com/ajax/libs/backbone.modelbinder/1.0.5/Backbone.CollectionBinder.min"
		, "backbone.iobind": "libs/backbone/backbone.iobind"
		, "backbone.iosync": "libs/backbone/backbone.iosync"
		, "backbone.marionette": window.protocol + "//cdnjs.cloudflare.com/ajax/libs/backbone.marionette/2.1.0/backbone.marionette.min"
		, "backbone.modelbinder": window.protocol + "//cdnjs.cloudflare.com/ajax/libs/backbone.modelbinder/1.0.5/Backbone.ModelBinder.min"
		, "cordova": "../cordova"
		, "cordova.loader": "libs/cordova/cordova.loader"
		, "detectmobilebrowser": "libs/detectmobilebrowser"
		, "jquery": window.protocol + "//ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min"
		, "jquery.browser": window.protocol + "//cdnjs.cloudflare.com/ajax/libs/jquery-browser/0.0.6/jquery.browser.min"
		, "jquery.cookie": window.protocol + "//cdnjs.cloudflare.com/ajax/libs/jquery-cookie/1.4.1/jquery.cookie.min"
		, "jquery.mobile": window.protocol + "//ajax.googleapis.com/ajax/libs/jquerymobile/1.4.3/jquery.mobile.min"
		, "modernizr": "libs/modernizr"
		, "primus.io": "libs/primus.io"
		, "text": window.protocol + "//cdnjs.cloudflare.com/ajax/libs/require-text/2.0.12/text.min"
		, "underscore": window.protocol + "//cdnjs.cloudflare.com/ajax/libs/lodash.js/2.4.1/lodash.underscore.min"
	}
	, shim: {
		"backbone": {
			deps: [
				"jquery"
				, "underscore"
			]
			, exports: "Backbone"
		}
		, "backbone.collectionbinder": {
			deps: [
				"backbone"
				, "backbone.modelbinder"
			]
		}
		, "backbone.iobind": {
			deps: [
				"backbone.iosync"
			]
		}
		, "backbone.iosync": {
			deps: [
				"primus.io"
				, "backbone"
			]
		}
		, "backbone.marionette": {
			deps: [
				"backbone"
			]
			, exports: "Marionette"
		}
		, "jquery": {
			exports: "$"
		}
		, "jquery.mobile": {
			deps: ["jquery"]
		}
		, "jquery.cookie": {
			deps: ["jquery"]
		}
		, "underscore": {
			exports: "_"
		}
	}
});

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

	require(["modernizr", "backbone.iobind", "backbone.collectionbinder", "jquery.mobile", "jquery.cookie", "jquery.browser"], function () {
		require(["app"], function (app) {
			app.start();
		});
	});
});

var loading = false;
function getScript(url, callback, isValidCallback) {
	if (typeof (isValidCallback) === "function") {
		if (isValidCallback() && callback) {
			callback();

			return;
		}
	}

	if (!loading) {
		loading = true;

		$.getScript(url, function () {
			loading = false;
		});
	}

	if (!callback) return;

	setTimeout(function () {
		getScript(url, callback, isValidCallback);
	}
		, 250
	);
}

function hasNetworkConnection() {
	return navigator.connection.type == Connection.WIFI
		|| navigator.connection.type == Connection.CELL_2G
		|| navigator.connection.type == Connection.CELL_3G
		|| navigator.connection.type == Connection.CELL_4G
		|| navigator.connection.type == Connection.CELL
		|| navigator.connection.type == Connection.ETHERNET
		|| navigator.connection.type == Connection.UNKNOWN;
}

function net(callback) {
	if (!hasNetworkConnection()) return;

	callback();
}