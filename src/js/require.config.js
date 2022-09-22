/* jshint maxcomplexity: false */
(function () {
	"use strict";
	window.isDEV = window.isDEV || !!window.__karma__ || !!window.testem;
	window.phonegap = document.location.protocol === "file:";
	var jQueryVersion = "2.2.1";
	if (!("querySelector" in document
		&& "localStorage" in window
		&& "addEventListener" in window)) {
		jQueryVersion = "1.12.1";
	}

	function _getPath(localPath, cdnPath, minSeparator, noSourceMap) {
		var path = []
			, min = (window.isDEV && noSourceMap ? "" : (minSeparator || ".") + "min");
		
		if (!window.phonegap) path.push(document.location.protocol + cdnPath + min);
		path.push(localPath + min);

		return path;
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
			, "jquery": "empty:"
			, "jquery.mobile": "empty:"
			, "modernizr": "libs/modernizr"
			, "primus.io": "libs/primus.io.min"
			, "react": "empty:"
			, "react.dom": "empty:"
			, "react.subschema": "libs/react/subschema"
			, "underscore": "empty:"
		}
		, map: {
			"*": {
				"react-dom": "react.dom"
				// HACK: For compatibility of primus with backbone.iobind.
				, "socket.io": "primus.io"
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
			, "react.dom": {
				deps: [
					"react"
				]
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
			"backbone": _getPath("libs/backbone/backbone", "//cdnjs.cloudflare.com/ajax/libs/backbone.js/1.3.2/backbone", "-")
			, "backbone.marionette": _getPath("libs/backbone/backbone.marionette", "//cdnjs.cloudflare.com/ajax/libs/backbone.marionette/2.4.4/backbone.marionette")
			, "backbone.react": _getPath("libs/backbone/backbone.react", "//cdnjs.cloudflare.com/ajax/libs/backbone-react-component/0.10.0/backbone-react-component", "-", true)
			, "cordova": "../cordova"
			, "jquery": _getPath("libs/jquery/jquery", "//ajax.googleapis.com/ajax/libs/jquery/" + jQueryVersion + "/jquery")
			// TODO: POC , "jquery.handsontable": _getPath("libs/jquery/jquery.handsontable", "//cdnjs.cloudflare.com/ajax/libs/handsontable/0.14.1/handsontable.full", null, true)
			, "jquery.mobile": _getPath("libs/jquery/jquery.mobile", "//ajax.googleapis.com/ajax/libs/jquerymobile/1.4.5/jquery.mobile")
			, "react": _getPath("libs/react/react", "//fb.me/react-with-addons-0.14.7", null, true)
			, "react.dom": _getPath("libs/react/react.dom", "//fb.me/react-dom-0.14.7", null, true)
			, "underscore": _getPath("libs/underscore/underscore", "//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore", "-")
		}
	});
})();