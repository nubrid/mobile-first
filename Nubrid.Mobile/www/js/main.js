require.config({
	urlArgs: "bust=" + (+new Date) // TODO: For PROD, replace with: urlArgs: "bust=v5.0.x"
	, baseUrl: "js"
	, paths: {
		"backbone": "libs/backbone/backbone"
		, "backbone.collectionbinder": "libs/backbone/backbone.collectionbinder"
		, "backbone.iobind": "libs/backbone/backbone.iobind"
		, "backbone.iosync": "libs/backbone/backbone.iosync"
		, "backbone.marionette": "libs/backbone/backbone.marionette"
		, "backbone.modelbinder": "libs/backbone/backbone.modelbinder"
		, "cordova": "../cordova"
		, "cordova.loader": "libs/cordova/cordova.loader"
		, "detectmobilebrowser": "libs/detectmobilebrowser"
		, "jquery": "libs/jquery/jquery"
		, "jquery.mobile": "libs/jquery/jquery.mobile"
		, "primus.io": "http://socket.nubrid.com/primus/primus.io"
		, "text": "libs/require/text"
		, "underscore": "libs/underscore/underscore.lodash"
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

	require(["backbone.iobind", "backbone.collectionbinder", "jquery.mobile"], function () {
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