/* jshint maxcomplexity: false */
(function() {
	// "use strict";
	const getjQueryVersion = function ( version ) {
		if ( !( "querySelector" in document
			&& "localStorage" in window
			&& "addEventListener" in window ) ) {
			return `1.12${version.substring(version.lastIndexOf( "." ) )}`;
		}

		return version;
	};

	const getPath = function ( localPath, cdnPath, minSeparator, noSourceMap ) {
		const path = [];
		let min = `${minSeparator || "."}min`;

		min = __DEV__ && noSourceMap ? "" : min;
		if ( cdnPath ) path.push( document.location.protocol + cdnPath + min );
		path.push( localPath + min );

		return path;
	};

	const rjs = requirejs;

	rjs.config( {
		urlArgs: "bust=v1.0.x" // TODO: For PROD, replace with latest release
		, baseUrl: "js"
		, paths: {
			"backbone": getPath( "libs/backbone/backbone", `//cdnjs.cloudflare.com/ajax/libs/backbone.js/${__VER_BACKBONE__}/backbone`, "-" )
			// , "backbone.immutable": getPath( "libs/backbone/backbone.immutable" )
			// , "backbone.iobind": getPath( "libs/backbone/backbone.iobind" )
			// , "backbone.iosync": getPath( "libs/backbone/backbone.iosync" )
			, "backbone.marionette": getPath( "libs/backbone/backbone.marionette", `//cdnjs.cloudflare.com/ajax/libs/backbone.marionette/${__VER_BACKBONE_MARIONETTE__}/backbone.marionette` )
			// , "backbone.pouchdb": getPath( "libs/backbone/backbone.pouchdb" )
			, "backbone.react": getPath( "libs/backbone/backbone.react", `//cdnjs.cloudflare.com/ajax/libs/backbone-react-component/${__VER_BACKBONE_REACT__}/backbone-react-component`, "-", true )
			// , "cordova": "../cordova"
			, "jquery": getPath( "libs/jquery/jquery", `//ajax.googleapis.com/ajax/libs/jquery/${getjQueryVersion( __VER_JQUERY__ )}/jquery` )
			, "jquery.mobile": getPath( "libs/jquery/jquery.mobile", `//ajax.googleapis.com/ajax/libs/jquerymobile/${__VER_JQUERY_MOBILE__}/jquery.mobile` )
			// , "modernizr": getPath( "libs/modernizr" )
			, "pouchdb": getPath( "libs/pouchdb/pouchdb", `//cdnjs.cloudflare.com/ajax/libs/pouchdb/${__VER_POUCHDB__}/pouchdb` )
			// , "pouchdb.socket": getPath( "libs/pouchdb/pouchdb.socket" )
			// , "primus.io": getPath( "libs/primus.io" )
			, "react": getPath( "libs/react/react", `//fb.me/react-with-addons-${__VER_REACT__}`, null, true )
			, "react.dom": getPath( "libs/react/react.dom", `//fb.me/react-dom-${__VER_REACT_DOM__}`, null, true )
			, "underscore": getPath( "libs/underscore/underscore", `//cdnjs.cloudflare.com/ajax/libs/underscore.js/${__VER_UNDERSCORE__}/underscore`, "-" )
			, "vendor": "vendor"
		}
		, map: {
			"*": {
				"react-dom": "react.dom"
				// HACK: For compatibility of primus with backbone.iobind.
				// , "socket.io": "primus.io"
				// , "socket.io-client": "primus.io"
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
			// , "backbone.immutable": {
			// 	deps: [
			// 		"backbone"
			// 	]
			// }
			// , "backbone.iobind": {
			// 	deps: [
			// 		"backbone.iosync"
			// 	]
			// }
			// , "backbone.iosync": {
			// 	deps: [
			// 		"primus.io"
			// 		, "backbone"
			// 	]
			// }
			, "backbone.marionette": {
				deps: [
					"backbone"
				]
				, exports: "Marionette"
			}
			// , "backbone.pouchdb": {
			// 	deps: [
			// 		"backbone"
			// 		, "pouchdb"
			// 		, "primus.io"
			// 	]
			// 	, exports: "BackbonePouch"
			// }
			, "backbone.react": {
				deps: [
					"backbone"
					, "react.dom"
				]
			}
			, "jquery": {
				exports: "$"
			}
			, "jquery.mobile": {
				deps: [ "jquery" ]
			}
			// , "modernizr": {
			// 	exports: "Modernizr"
			// }
			, "pouchdb": {
				exports: "PouchDB"
			}
			// , "pouchdb.socket": {
			// 	deps: [
			// 		"pouchdb"
			// 	]
			// }
			, "react.dom": {
				deps: [
					"react"
				]
			}
			, "underscore": {
				exports: "_"
			}
			, "vendor": {
				deps: [
					"backbone.marionette"
					, "backbone.react"
				]
			}
		}
	} );
} )();