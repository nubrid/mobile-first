({
	appDir: "../"
	, paths: {
		"backbone": "empty:" //"libs/backbone/backbone"
		, "backbone.collectionbinder": "empty:" //"libs/backbone/backbone.collectionbinder"
		, "backbone.iobind": "libs/backbone/backbone.iobind"
		, "backbone.iosync": "libs/backbone/backbone.iosync"
		, "backbone.marionette": "empty:" //"libs/backbone/backbone.marionette"
		, "backbone.modelbinder": "empty:" //"libs/backbone/backbone.modelbinder"
		, "cordova": "empty:"
		, "cordova.loader": "empty:"
		, "detectmobilebrowser": "libs/detectmobilebrowser"
		, "jquery": "empty:" //"libs/jquery/jquery"
		// TODO:, "jquery.browser": "empty:" //"libs/jquery/jquery.browser"
		// TODO:, "jquery.cookie": "empty:" //"libs/jquery/jquery.cookie"
		// TODO:, "jquery.history": "empty:" //"libs/jquery/jquery.history"
		, "jquery.mobile": "empty:" //"libs/jquery/jquery.mobile"
		// TODO:, "modernizr": "libs/modernizr"
		, "primus.io": "libs/primus.io"
		, "text": "empty:" //"libs/require/text"
		, "underscore": "empty:" //"libs/underscore/underscore.lodash"
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
	, baseUrl: "js"
	, dir: "../../www-build"
	, modules: [
		{
			name: "main"
		}
	]
	, exclude: [
		"backbone"
		, "backbone.collectionbinder"
		, "backbone.iobind"
		, "backbone.iosync"
		, "backbone.marionette"
		, "backbone.modelbinder"
		, "cordova"
		, "jquery"
		// TODO:, "jquery.browser"
		// TODO:, "jquery.cookie"
		// TODO:, "jquery.history"
		, "jquery.mobile"
		, "text"
		, "underscore"
	]
	, findNestedDependencies: true
	, optimizeCss: "standard.keepLines"
})