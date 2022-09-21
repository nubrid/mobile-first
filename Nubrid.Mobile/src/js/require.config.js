/* jshint maxcomplexity: false */
(function () {
	"use strict";
	window.isDEV = true; // TODO: Comment out for PROD
	window.phonegap = document.location.protocol === "file:";
	window.host = "//" + (window.phonegap ? "www.nubrid.com" : document.location.host);
	window.protocol = window.phonegap
		? (window.isDEV ? "http:" : "https:")
		: document.location.protocol;
	var jQueryVersion = "2.1.4";
	if (!("querySelector" in document
		&& "localStorage" in window
		&& "addEventListener" in window)) {
		jQueryVersion = "1.11.3";
	}

	function _getPath(localPath, cdnPath, minSeparator, noSourceMap) {
		var libProtocol = window.phonegap ? "https:" : document.location.protocol;
		return (window.phonegap ? localPath : libProtocol + cdnPath)
			+ (window.isDEV && noSourceMap ? "" : (minSeparator || ".") + "min");
	}

	require.config({
		baseUrl: "js"
		, paths: {
			"backbone": "empty:"
			, "backbone.iobind": "libs/backbone/backbone.iobind.min"
			, "backbone.iosync": "libs/backbone/backbone.iosync.min"
			, "backbone.marionette": "empty:"
			, "backbone.react": "empty:"
			, "cordova": "empty:"
			, "cordova.loader": "empty:"
			, "jquery": "empty:"
			, "jquery.mobile": "empty:"
			, "modernizr": "libs/modernizr"
			, "primus.io": "libs/primus.io.min"
			, "react": "empty:"
			, "react.subschema": "libs/react/subschema"
			, "underscore": "empty:"
		}
		, map: {
			"*": {
				// HACK: For compatibility of primus with backbone.iobind.
				"socket.io": "primus.io"
				, "socket.io-client": "primus.io"
			}
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
			// TODO: POC , "jquery.handsontable": {
			//	deps: ["jquery"]
			//}
			, "jquery.mobile": {
				deps: ["jquery"]
			}
			, "modernizr": {
				exports: "Modernizr"
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
	require.config({
		urlArgs: "bust=v1.0.x" // TODO: For PROD, replace with latest release
		, paths: {
			"backbone": _getPath("libs/backbone/backbone", "//cdnjs.cloudflare.com/ajax/libs/backbone.js/1.2.1/backbone", "-")
			, "backbone.marionette": _getPath("libs/backbone/backbone.marionette", "//cdnjs.cloudflare.com/ajax/libs/backbone.marionette/2.4.2/backbone.marionette")
			, "backbone.react": _getPath("libs/backbone/backbone.react", "//cdnjs.cloudflare.com/ajax/libs/backbone-react-component/0.8.1/backbone-react-component", "-", true)
			, "cordova": "../cordova"
			, "cordova.loader": "libs/cordova/cordova.loader"
			, "jquery": _getPath("libs/jquery/jquery", "//ajax.googleapis.com/ajax/libs/jquery/" + jQueryVersion + "/jquery")
			// TODO: POC , "jquery.handsontable": _getPath("libs/jquery/jquery.handsontable", "//cdnjs.cloudflare.com/ajax/libs/handsontable/0.14.1/handsontable.full", null, true)
			, "jquery.mobile": _getPath("libs/jquery/jquery.mobile", "//ajax.googleapis.com/ajax/libs/jquerymobile/1.4.5/jquery.mobile")
			, "livereload": "http://live.nubrid.com:8081/livereload"
			, "react": _getPath("libs/react/react", "//fb.me/react-with-addons-0.13.3", null, true)
			, "underscore": _getPath("libs/underscore/underscore", "//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore", "-")
		}
	});
})();