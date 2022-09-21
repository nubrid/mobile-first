({
	appDir: "../"
	, paths: {
		"backbone": "empty:" //"libs/backbone/backbone"
		, "backbone.iobind": "libs/backbone/backbone.iobind"
		, "backbone.iosync": "libs/backbone/backbone.iosync"
		, "backbone.marionette": "empty:" //"libs/backbone/backbone.marionette"
		, "backbone.react": "empty:" //"libs/backbone/backbone.react"
		, "cordova": "empty:"
		, "cordova.loader": "empty:"
		// TODO:, "detectmobilebrowser": "libs/detectmobilebrowser"
		, "jquery": "empty:" //"libs/jquery/jquery"
		// TODO:, "jquery.browser": "empty:" //"libs/jquery/jquery.browser"
		// TODO:, "jquery.cookie": "empty:" //"libs/jquery/jquery.cookie"
		// TODO: POC , "jquery.handsontable": "empty:" //"libs/jquery/jquery.handsontable"
		// TODO:, "jquery.history": "empty:" //"libs/jquery/jquery.history"
		, "jquery.mobile": "empty:" //"libs/jquery/jquery.mobile"
		// TODO:, "modernizr": "libs/modernizr"
		, "primus.io": "libs/primus.io"
		, "react": "empty:" //"libs/react/react"
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
		, "backbone.iobind"
		, "backbone.iosync"
		, "backbone.marionette"
		, "backbone.react"
		, "cordova"
		, "jquery"
		// TODO:, "jquery.browser"
		// TODO:, "jquery.cookie"
		// TODO: POC , "jquery.handsontable"
		// TODO:, "jquery.history"
		, "jquery.mobile"
		, "react"
		, "text"
		, "underscore"
	]
	, findNestedDependencies: true
	, optimizeCss: "standard.keepLines"
})