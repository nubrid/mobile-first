var loading = false
	, Event = { DeviceReady: "deviceready" }
	, Key = { Email: "email" }
	, Method = { GetById: "getById" }
	, Url = {
		IO: { Root: "http://socket.excentone.com" }
		, Web: "http://apps.excentone.com"
	};

window.App = {
	Models: {}
	, Collections: {}
	, Views: {}
};

require.config({
	baseUrl: "js"
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
		, "socket.io": "http://socket.excentone.com/socket.io/socket.io"
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
				"socket.io"
				, "backbone"
				, "backbone.iosync"
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

	require(["socket.io", "backbone.iobind", "backbone.collectionbinder", "jquery.mobile"], function () {
		window.io = io; // HACK: For socket.io 1.0.x
		require(["app"], function (app) {
			app.start();
		});
	});
});

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