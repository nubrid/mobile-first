const webpack = require( "webpack" )
	, { Config } = require( "webpack-config" )
	, cspBuilder = require( "content-security-policy-builder" )
	, fs = require( "fs" )
	, LodashWebpackPlugin = require( "lodash-webpack-plugin" )
	, path = require( "path" )
	, _appConfig = require( "./app.config" )
	, _getDirectories = ( sourcePath, filterRegex ) =>
		fs.readdirSync( sourcePath ).filter( file => // eslint-disable-line lodash/prefer-lodash-method
			filterRegex.test( file ) && fs.statSync( path.join( sourcePath, file ) ).isDirectory()
		)
	, _host = _appConfig.web.host;

const _primus = new (require( "primus.io" ))( new ( require( "events" ) ).EventEmitter(), { transformer: _appConfig.primus.transformer });
_primus.save( path.resolve( "dist/primus.io.js" ) );

const _config = {
	entry: {
		main: "main"
		, vendor: [ // HACK: Must follow dependency sequence
			"./modernizr-config.json"
			, "backbone"
			, "react"
			, "react-dom"
			, "react-addons-transition-group"
			, "react-addons-css-transition-group"
			, "backbone.react"
		]
	}
	, output: {
		path: "src"
		, filename: "js/[name].js"
		, chunkFilename: "js/[id].js"
	}
	, plugins: [
		new webpack.ContextReplacementPlugin( /apps$/, new RegExp( `^\.\/(${_getDirectories( "script/js/apps", /^(?!common).*$/ ).join( "|" )})\/index.js$` ) )
		, new webpack.DefinePlugin( {
			__MOBILE__: JSON.stringify( JSON.parse( process.env.MOBILE || "false" ) )
			, __URL__: JSON.stringify( `${process.env.URL || ""}`.trim() )
		} )
		, new webpack.IgnorePlugin( /^cordova|jquery$/ ) // HACK: For backbone to work, ignore jquery
		, new webpack.ProvidePlugin( {
			AppManager: "apps/common"
			, Backbone: "backbone"
			, BackboneImmutable: "immutable-backbone"
			, BackboneReactMixin: "backbone.react"
			, Modernizr: path.resolve( "modernizr-config.json" )
			, React: "react"
			, ReactDOM: "react-dom"
			, ReactCSSTransitionGroup: "react-addons-css-transition-group"
			, ReactRedux: "react-redux"
			, ReactTransitionGroup: "react-addons-transition-group"
			, Redux: "redux"

			, chai: "chai"
			, sinon: "sinon/pkg/sinon"
		} )
		, new LodashWebpackPlugin( { // HACK: If backbone fails, add lodash features
			"caching": false
			, "chaining": false
			, "cloning": true
			, "coercions": false
			, "collections": true
			, "currying": false
			, "deburring": false
			, "exotics": false
			, "flattening": false
			, "guards": false
			, "memoizing": false
			, "metadata": false
			, "paths": true
			, "placeholders": false
			, "shorthands": false
			, "unicode": false
		})
	]
	, resolve: {
		root: [ path.resolve( "script/js" ) ]
		// TODO: , extensions: [ "", ".js", ".json", ".coffee" ]
		, modulesDirectories: [ "node_modules", "dist" ]
		, alias: {
			// TODO: Remove - "backbone.iosync": "backbone.iobind/lib/sync"
			"backbone.react$": "backbone-react-component/lib/component"
			, "cordova": "../cordova"
			, "pouchdb$": "libs/pouchdb"
			, "pouchdb-socket$": "socket-pouch/lib/client"
			, "primus.io$": "primus.io.js"
			, "underscore": "libs/lodash"
		}
	}
	, module: {
		loaders: [
			{ test: /\.jsx?$/, loader: "babel"
				, exclude: /(dist|node_modules|bower_components)/
				, query: {
					plugins: [
						"lodash"
						// TODO: , "rewire"
						, "transform-class-properties"
						, "transform-es2015-modules-simple-commonjs" // HACK: Until webpack v2 is released
						, "transform-object-rest-spread"
						, "transform-runtime"
					]
					, cacheDirectory: true
				}
			}
			, { test: /\.(png|jpg)$/, loader: "url?limit=8192" }
			, { test: /\.css$/, loader: "style!css" }
			, { test: /\.less$/, loader: "style!css!less" } // TODO: Use LESS for CSS

			, { test: /backbone\.js$/, loader: "imports?define=>false" } // HACK: For backbone to work
			, { test: /modernizr-config\.json$/, loader: "modernizr" }

			, { test: /\.coffee$/, loader: "coffee" }
			, { test: /sinon.*\.js$/, loader: "imports?define=>false,require=>false" }
		]
		, noParse: [
			/primus\.io/

			, /sinon\/pkg\/sinon/
		]
	}
	, csp: {
		directives: {
			defaultSrc: [ "'self'", "gap:", "https://ssl.gstatic.com" ]
			, mediaSrc: "*"
			, imgSrc: [ "'self'", "data:" ]
			, scriptSrc: [ "'self'", `*.${_host}:*`, `http://*.${_host}:*` ] // TODO: , "*.cloudflare.com:*", "*.googleapis.com:*", "fb.me:*", "*.fbcdn.net:*", "'sha256-b+bPlHI3Xupxz+xXVTazjfiOEv9to4g5ULdU6ZR+MKw='" ]
			, connectSrc: [ `ws://*.${_host}:*`, `wss://*.${_host}:*` ] // , "*.microsoftonline.com:*" ] -- for SharePoint
			, styleSrc: [ "'self'", "'unsafe-inline'" ]
			, childSrc: "*"
		}
		, toString() {
			return cspBuilder( { directives: this.directives } );
		}
	}
};

if ( process.env.URL ) _config.csp.directives.connectSrc.push( `ws://${process.env.URL.trim()}:*`, `wss://${process.env.URL.trim()}:*` );

module.exports = new Config().merge( _config );