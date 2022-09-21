window.isDEV = true; // TODO: Comment out for PROD
window.phonegap = document.location.protocol === "file:";
window.host = "//" + (window.phonegap ? "www.nubrid.com" : document.location.host);
window.protocol = window.phonegap ? "http:" : document.location.protocol;
_libProtocol = window.phonegap ? "https:" : document.location.protocol;
_libMinify = window.isDEV ? "" : ".min";
var jQueryVersion = "2.1.4";
if (!("querySelector" in document
    && "localStorage" in window
    && "addEventListener" in window)) {
	jQueryVersion = "1.11.3"
}
require.config({
	urlArgs: "bust=v1.0.x" // TODO: For PROD, replace with latest release
	, baseUrl: "js"
	, paths: {
		"backbone": window.phonegap ? "libs/backbone/backbone" : _libProtocol + "//cdnjs.cloudflare.com/ajax/libs/backbone.js/1.2.0/backbone" + (_libMinify.length ? _libMinify.replace(".", "-") : "")
		, "backbone.iobind": "libs/backbone/backbone.iobind"
		, "backbone.iosync": "libs/backbone/backbone.iosync"
		, "backbone.marionette": window.phonegap ? "libs/backbone/backbone.marionette" : _libProtocol + "//cdnjs.cloudflare.com/ajax/libs/backbone.marionette/2.4.1/backbone.marionette" + _libMinify
		, "backbone.react": window.phonegap ? "libs/backbone/backbone.react" : _libProtocol + "//cdnjs.cloudflare.com/ajax/libs/backbone-react-component/0.8.1/backbone-react-component" + (_libMinify.length ? _libMinify.replace(".", "-") : "")
		, "cordova": "../cordova"
		, "cordova.loader": "libs/cordova/cordova.loader"
		// TODO:, "detectmobilebrowser": "libs/detectmobilebrowser"
		, "jquery": window.phonegap ? "libs/jquery/jquery" : _libProtocol + "//ajax.googleapis.com/ajax/libs/jquery/" + jQueryVersion + "/jquery" + _libMinify
		// TODO:, "jquery.browser": window.phonegap ? "libs/jquery/jquery.browser" : _libProtocol + "//cdnjs.cloudflare.com/ajax/libs/jquery-browser/0.0.6/jquery.browser" + _libMinify
		// TODO:, "jquery.cookie": window.phonegap ? "libs/jquery/jquery.cookie" : _libProtocol + "//cdnjs.cloudflare.com/ajax/libs/jquery-cookie/1.4.1/jquery.cookie" + _libMinify
		// TODO: POC , "jquery.handsontable": window.phonegap ? "libs/jquery/jquery.handsontable" : _libProtocol + "//cdnjs.cloudflare.com/ajax/libs/handsontable/0.14.1/handsontable.full" + _libMinify
		// TODO:, "jquery.history": window.phonegap ? "libs/jquery/jquery.history" : _libProtocol + "//cdnjs.cloudflare.com/ajax/libs/jquery-history/1.9/jquery.history" + _libMinify
		, "jquery.mobile": window.phonegap ? "libs/jquery/jquery.mobile" : _libProtocol + "//ajax.googleapis.com/ajax/libs/jquerymobile/1.4.5/jquery.mobile" + _libMinify
		// TODO:, "modernizr": "libs/modernizr"
		, "primus.io": "libs/primus.io"
		, "react": window.phonegap ? "libs/react/react" : _libProtocol + "//fb.me/react-with-addons-0.13.3" + _libMinify
		, "react.subschema": "libs/react/subschema"
		// TODO:, "text": window.phonegap ? "libs/require/text" : _libProtocol + "//cdnjs.cloudflare.com/ajax/libs/require-text/2.0.12/text" + _libMinify
		, "underscore": window.phonegap ? "libs/underscore/underscore" : _libProtocol + "//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore" + (_libMinify.length ? _libMinify.replace(".", "-") : "")
	}
	, shim: {
		"backbone": {
			deps: [
				"jquery"
				, "underscore"
			]
			, exports: "Backbone"
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
		// TODO: POC , "jquery.handsontable": {
		//	deps: ["jquery"]
		//}
		// TODO:, "jquery.history": {
		//	deps: ["jquery"]
		//}
		, "jquery.mobile": {
			deps: ["jquery"]
		}
		, "react.subschema": {
			deps: [
				"react"
			]
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

	require(["backbone.iobind", "jquery.mobile"], function () {
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