({
	appDir: "../"
	, paths: {
		"backbone": "empty:"
		, "backbone.collectionbinder": "empty:"
		, "backbone.iobind": "empty:"
		, "backbone.iosync": "empty:"
		, "backbone.marionette": "empty:"
		, "backbone.modelbinder": "empty:"
		, "cordova": "empty:"
		, "cordova.loader": "libs/cordova/cordova.loader"
		, "detectmobilebrowser": "libs/detectmobilebrowser"
		, "jquery": "empty:"
		, "jquery.cookie": "empty:"
		, "jquery.mobile": "empty:"
		, "modernizr": "libs/modernizr"
		, "primus.io": "libs/primus.io"
		, "text": "libs/require/text"
		, "underscore": "empty:"
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
	, baseUrl: "js"
	, dir: "../../www-build"
	, modules: [{
		name: "main"
	}]
	, exclude: [
		"backbone"
		, "backbone.collectionbinder"
		, "backbone.iobind"
		, "backbone.iosync"
		, "backbone.marionette"
		, "backbone.modelbinder"
		, "cordova"
		, "jquery"
		, "jquery.cookie"
		, "jquery.mobile"
		, "text"
		, "underscore"
	]
	, findNestedDependencies: true
	, optimizeCss: "standard.keepLines"
})