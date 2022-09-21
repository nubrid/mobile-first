window.host = "//" + document.location.host;
window.protocol = document.location.protocol;
window.phonegap = window.protocol === "file:";
_libProtocol = (window.phonegap ? "https:" : window.protocol);
_libMinify = ""; // TODO: For PROD, replace with: _libMinify = ".min";
require.config({
	urlArgs: "bust=v1.0.x"
	, baseUrl: "js"
	, paths: {
		"backbone": _libProtocol + "//cdnjs.cloudflare.com/ajax/libs/backbone.js/1.1.2/backbone" + (_libMinify.length ? _libMinify.replace(".", "-") : "") //"libs/backbone/backbone"
		, "backbone.collectionbinder": _libProtocol + "//cdnjs.cloudflare.com/ajax/libs/backbone.modelbinder/1.0.5/Backbone.CollectionBinder" + _libMinify //"libs/backbone/backbone.collectionbinder"
		, "backbone.iobind": "libs/backbone/backbone.iobind"
		, "backbone.iosync": "libs/backbone/backbone.iosync"
		, "backbone.marionette": _libProtocol + "//cdnjs.cloudflare.com/ajax/libs/backbone.marionette/2.1.0/backbone.marionette" + _libMinify //"libs/backbone/backbone.marionette"
		, "backbone.modelbinder": _libProtocol + "//cdnjs.cloudflare.com/ajax/libs/backbone.modelbinder/1.0.5/Backbone.ModelBinder" + _libMinify //"libs/backbone/backbone.modelbinder"
		, "backbone.react": _libProtocol + "//cdnjs.cloudflare.com/ajax/libs/backbone-react-component/0.8.1/backbone-react-component" + (_libMinify.length ? _libMinify.replace(".", "-") : "") //"libs/backbone/backbone.react"
		, "cordova": "../cordova"
		, "cordova.loader": "libs/cordova/cordova.loader"
		, "detectmobilebrowser": "libs/detectmobilebrowser"
		, "jquery": _libProtocol + "//ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery" + _libMinify //"libs/jquery/jquery"
		// TODO:, "jquery.browser": _libProtocol + "//cdnjs.cloudflare.com/ajax/libs/jquery-browser/0.0.6/jquery.browser" + _libMinify //"libs/jquery/jquery.browser"
		// TODO:, "jquery.cookie": _libProtocol + "//cdnjs.cloudflare.com/ajax/libs/jquery-cookie/1.4.1/jquery.cookie" + _libMinify //"libs/jquery/jquery.cookie"
		// TODO:, "jquery.history": _libProtocol + "//cdnjs.cloudflare.com/ajax/libs/jquery-history/1.9/jquery.history" + _libMinify //"libs/jquery/jquery.history"
		, "jquery.mobile": _libProtocol + "//ajax.googleapis.com/ajax/libs/jquerymobile/1.4.5/jquery.mobile" + _libMinify //"libs/jquery/jquery.mobile"
		// TODO:, "modernizr": "libs/modernizr"
		, "primus.io": "libs/primus.io"
		, "react": _libProtocol + "//fb.me/react-with-addons-0.13.3" + _libMinify //"libs/react/react"
		, "text": _libProtocol + "//cdnjs.cloudflare.com/ajax/libs/require-text/2.0.12/text" + _libMinify //"libs/require/text"
		, "underscore": _libProtocol + "//cdnjs.cloudflare.com/ajax/libs/lodash.js/2.4.1/lodash.underscore" + _libMinify //"libs/underscore/underscore.lodash"
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
		, "backbone.react": {
			deps: [
				"backbone"
				, "react"
			]
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