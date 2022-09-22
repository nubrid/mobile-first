/* jshint maxcomplexity: false */
(function () {
	// "use strict";
	if (!!window.__karma__ || !!window.testem) window.isDEV = true;
	window.phonegap = document.location.protocol === "file:";
	window.url = window.phonegap
		? `${window.isDEV ? "http:" : "https:"}//${document.body.getAttribute("data-host")}`
		: `${document.location.protocol}//${document.location.host}`;

	function getjQueryVersion (version) {
		if (!("querySelector" in document
			&& "localStorage" in window
			&& "addEventListener" in window)) {
			return "1.12" + version.substring(version.lastIndexOf("."));
		}
		
		return version;
	}

	function _getPath(localPath, cdnPath, minSeparator, noSourceMap) {
		let path = []
			, min = `${minSeparator || "."}min`;
		
		if (!window.phonegap) {
			min = window.isDEV && noSourceMap ? "" : min;
			if (cdnPath) path.push(document.location.protocol + cdnPath + min);
			path.push(localPath + min);
		}
		else 
		{
			path.push(localPath + min);
		}

		return path;
	}

	require.config({
		baseUrl: "js"
		, paths: {
			"backbone": "empty:"
			, "backbone.immutable": "empty:"
			, "backbone.iobind": "empty:"
			, "backbone.iosync": "empty:"
			, "backbone.marionette": "empty:"
			, "backbone.react": "empty:"
			, "cordova": "empty:"
			, "jquery": "empty:"
			, "jquery.mobile": "empty:"
			, "modernizr": "libs/modernizr.min"
			, "primus.io": "empty:"
			, "react": "empty:"
			, "react.dom": "empty:"
			, "react.subschema": "libs/react/subschema.min"
			, "underscore": "empty:"
			, "main.config": "main.config"
			, "main.config.version": "main.config.version"
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
			, "backbone.immutable": {
				deps: [
					"backbone"
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
			, "main.config": {
				deps: [
					"main.config.version"
				]
			}
		}
	});
	require([(window.baseUrl || "") + "main.config.version"], version => {
		require.config({
			urlArgs: "bust=v1.0.x" // TODO: For PROD, replace with latest release
			, paths: {
				"backbone": _getPath("libs/backbone/backbone", `//cdnjs.cloudflare.com/ajax/libs/backbone.js/${version.backbone}/backbone`, "-")
				, "backbone.immutable": _getPath("libs/backbone/backbone.immutable")
				, "backbone.iobind": _getPath("libs/backbone/backbone.iobind")
				, "backbone.iosync": _getPath("libs/backbone/backbone.iosync")
				, "backbone.marionette": _getPath("libs/backbone/backbone.marionette", `//cdnjs.cloudflare.com/ajax/libs/backbone.marionette/${version["backbone.marionette"]}/backbone.marionette`)
				, "backbone.react": _getPath("libs/backbone/backbone.react", `//cdnjs.cloudflare.com/ajax/libs/backbone-react-component/${version["backbone-react-component"]}/backbone-react-component`, "-", true)
				, "cordova": "../cordova"
				, "jquery": _getPath("libs/jquery/jquery", `//ajax.googleapis.com/ajax/libs/jquery/${getjQueryVersion(version.jquery)}/jquery`)
				, "jquery.mobile": _getPath("libs/jquery/jquery.mobile", `//ajax.googleapis.com/ajax/libs/jquerymobile/${version["jquery-mobile"]}/jquery.mobile`)
				, "primus.io": _getPath("libs/primus.io")
				, "react": _getPath("libs/react/react", `//fb.me/react-with-addons-${version.react}`, null, true)
				, "react.dom": _getPath("libs/react/react.dom", `//fb.me/react-dom-${version["react-dom"]}`, null, true)
				, "underscore": _getPath("libs/underscore/underscore", `//cdnjs.cloudflare.com/ajax/libs/underscore.js/${version.underscore}/underscore`, "-")
			}
		});
	});
})();