window.host = "//" + document.location.host;
window.protocol = document.location.protocol;
window.phonegap = window.protocol === "file:";
require.config({
	urlArgs: "bust=" + (+new Date) // TODO: For PROD, replace with: urlArgs: "bust=v1.0.x"
	, baseUrl: "js"
	, paths: {
		"backbone": (window.phonegap ? "https:" : window.protocol) + "//cdnjs.cloudflare.com/ajax/libs/backbone.js/1.1.2/backbone-min" //"libs/backbone/backbone"
		, "backbone.collectionbinder": (window.phonegap ? "https:" : window.protocol) + "//cdnjs.cloudflare.com/ajax/libs/backbone.modelbinder/1.0.5/Backbone.CollectionBinder.min" //"libs/backbone/backbone.collectionbinder"
		, "backbone.iobind": "libs/backbone/backbone.iobind"
		, "backbone.iosync": "libs/backbone/backbone.iosync"
		, "backbone.marionette": (window.phonegap ? "https:" : window.protocol) + "//cdnjs.cloudflare.com/ajax/libs/backbone.marionette/2.1.0/backbone.marionette.min" //"libs/backbone/backbone.marionette"
		, "backbone.modelbinder": (window.phonegap ? "https:" : window.protocol) + "//cdnjs.cloudflare.com/ajax/libs/backbone.modelbinder/1.0.5/Backbone.ModelBinder.min" //"libs/backbone/backbone.modelbinder"
		, "cordova": "../cordova"
		, "cordova.loader": "libs/cordova/cordova.loader"
		, "detectmobilebrowser": "libs/detectmobilebrowser"
		, "jquery": (window.phonegap ? "https:" : window.protocol) + "//ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min" //"libs/jquery/jquery"
		// TODO:, "jquery.browser": (window.phonegap ? "https:" : window.protocol) + "//cdnjs.cloudflare.com/ajax/libs/jquery-browser/0.0.6/jquery.browser.min" //"libs/jquery/jquery.browser"
		// TODO:, "jquery.cookie": (window.phonegap ? "https:" : window.protocol) + "//cdnjs.cloudflare.com/ajax/libs/jquery-cookie/1.4.1/jquery.cookie.min" //"libs/jquery/jquery.cookie"
		// TODO:, "jquery.history": (window.phonegap ? "https:" : window.protocol) + "//cdnjs.cloudflare.com/ajax/libs/history.js/1.8/bundled-uncompressed/html4+html5/jquery.history"
		, "jquery.mobile": (window.phonegap ? "https:" : window.protocol) + "//ajax.googleapis.com/ajax/libs/jquerymobile/1.4.5/jquery.mobile.min" //"libs/jquery/jquery.mobile"
		// TODO:, "modernizr": "libs/modernizr"
		, "primus.io": "libs/primus.io"
		, "text": (window.phonegap ? "https:" : window.protocol) + "//cdnjs.cloudflare.com/ajax/libs/require-text/2.0.12/text.min" //"libs/require/text"
		, "underscore": (window.phonegap ? "https:" : window.protocol) + "//cdnjs.cloudflare.com/ajax/libs/lodash.js/2.4.1/lodash.underscore.min" //"libs/underscore/underscore.lodash"
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
		// TODO:, "jquery.cookie": {
		//	deps: ["jquery"]
		//}
		// TODO:, "jquery.history": {
		//	deps: ["jquery"]
		//}
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