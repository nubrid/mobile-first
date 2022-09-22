/* global mocha */
(function() {
const _root = window.__karma__ ? "/base" : "../..";
// TODO: require.config( {
// 	paths: {
// 		"chai": _root + "/node_modules/chai/chai"
// 		, "chai.as.promised": _root + "/node_modules/chai-as-promised/lib/chai-as-promised"
// 		, "chai.jquery": _root + "/node_modules/chai-jquery/chai-jquery"
// 		, "react.phantomjs": _root + "/src/js/libs/react/react.phantomjs"
// 		, "sinon": _root + "/node_modules/sinon/pkg/sinon"
// 		, "sinon.chai": _root + "/node_modules/sinon-chai/lib/sinon-chai"
// 	}
// 	, shim: {
// 		"chai": {
// 			exports: "chai"
// 		}
// 		, "chai.as.promised": {
// 			deps: [
// 				"chai"
// 			]
// 		}
// 		, "chai.jquery": {
// 			deps: [
// 				"chai"
// 			]
// 		}
// 		, "sinon": {
// 			exports: "sinon"
// 		}
// 		, "sinon.chai": {
// 			deps: [
// 				"chai"
// 				, "sinon"
// 			]
// 		}
// 	}
// } );

function _init( options ) {
	// TODO: var _requireConfig = options.baseUrl + "/main.config" + ( window.__karma__ ? ".js" : "" );
	// var _config = [ _requireConfig ];
	// if ( options.config ) _config.push( options.config );

	// require( _config, function() {
	// 	require.config( {
	// 		baseUrl: options.baseUrl
	// 		, urlArgs: null
	// 	} );

		mocha.setup( "bdd" );

		// TODO: var _modules = [ "jquery", "sinon.chai", "chai.jquery", "chai.as.promised" ];
		// if ( options.module ) _modules.push( options.module );
		// if ( /PhantomJS/.test( window.navigator.userAgent ) ) _modules.push( "react.phantomjs" );

		// TODO: require( _modules, function() {
			// $( document ).on( "mobileinit", function() {
			// 	$.support.cors = true;
			// 	$.mobile.allowCrossDomainPages = true;

			// 	// Use Backbone routing
			// 	$.mobile.autoInitializePage = false;
			// 	$.mobile.linkBindingEnabled = false;
			// 	$.mobile.hashListeningEnabled = false;
			// 	$.mobile.pushStateEnabled = false;
			// } );

			chai.use( require( "chai-as-promised" ) )
				.use( require( "chai-jquery" ) );
			require( "sinon-chai" );
			window.expect = chai.expect;
			window.should = chai.should();

			// TODO: window.rewire = require( "rewire" );

			// TODO: require( [ "backbone.iobind", "jquery.mobile", "modernizr" ], function() {

				let context = require.context( "../test", true, /^(.*-spec\.(coffee$))[^.]*$/igm );
				context.keys().forEach( context );
				context = require.context( "../script", true, /^(.*-spec\.(coffee$))[^.]*$/igm );
				context.keys().forEach( context );

				// TODO: options.callback();
			// } );
		// TODO: } );
	// TODO: } );
}

if ( window.__karma__ ) {
	// TODO: var files = [];
	// var regex = /(spec|test)\.js$/i;

	// // Get a list of all the test files to include
	// Object.keys( window.__karma__.files ).forEach( function( file ) {
	// 	if ( regex.test( file ) ) {
	// 		// Normalize paths to RequireJS module names.
	// 		// If you require sub-dependencies of test files to be loaded as-is (requiring file extension)
	// 		// then do not normalize the paths
	// 		files.push( "../../" + file.replace( /^\/base\/|\.js$/g, "" ) );
	// 	}
	// } );

	_init( {
		// TODO: // Karma serves files under /base, which is the basePath from your config file
		// baseUrl: document.location.protocol + "//" + document.location.host + _root + "/src/js"
		// , callback: function() {
		// 	require.config( {
		// 		// dynamically load all test files
		// 		deps: files,

		// 		// we have to kickoff jasmine, as it is asynchronous
		// 		callback: window.__karma__.start
		// 	} );
		// }
		callback: window.__karma__.start
	} );
}
// TODO: else if ( window.testem ) {
// 	var _baseUrl = "../src/js";
// 	window.baseUrl = "../" + _baseUrl + "/";
// 	_init( {
// 		baseUrl: _baseUrl
// 		, config: "../node_modules/mocha/mocha"
// 		, module: _root + "/testem"
// 		, callback: function() {
// 			require( window.testem.files, function() {
// 				mocha.run();
// 			} );
// 		}
// 	} );
// }
})();