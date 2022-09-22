/*
AppManager
*/
const _appManager = new Marionette.Application( {
	Transition: {
		ListItem: { transitionName: "list-item", transitionEnterTimeout: 500, transitionLeaveTimeout: 500 }
	}
	, changePage( options ) {
		this.currentLayout = this.currentLayout && ( this.currentLayout instanceof options.Layout )
			? this.currentLayout.initialize( options )
			: new options.Layout( options );
		$.mobile.initializePage();

		if ( options.id ) this.navigate( options.id );

		return this.currentLayout.MainRegion.currentView;
	}
	, currentRoute() {
		return Backbone.history.fragment;
	}
	, navigate( route, options ) {
		Backbone.history.navigate( route, options );
	}
	, net( callback ) {
		function isDeviceOnline() {
			return navigator.connection
				&& ( navigator.connection.type === Connection.WIFI
				|| navigator.connection.type === Connection.CELL_2G
				|| navigator.connection.type === Connection.CELL_3G
				|| navigator.connection.type === Connection.CELL_4G
				|| navigator.connection.type === Connection.CELL
				|| navigator.connection.type === Connection.ETHERNET
				|| navigator.connection.type === Connection.UNKNOWN );
		}

		if ( isDeviceOnline() ) {
			callback();
		}
		else {
			this.request( "connect", { callback, closeOnOpen: true } );
		}
	}
	, onStart() {
		Marionette.Region.prototype.attachHtml = () => {};

		function start() {
			if ( Backbone.history ) {
				$( ".back" ).on( "click", function() {
					window.history.back();
					return false;
				} );

				/* jshint nonew: false */
				new Marionette.AppRouter( {
					appRoutes: {
						"": "initRoute"
						, ":mod(/)": "initRoute"
						, ":mod/:id(/)": "initRoute" // TODO: need to test!
					}
					, controller: {
						initRoute( name ) {
							const appName = name || "home";

							require.ensure( [], require => {
								const request = require.context( "./common", false, /^(.*\.(js$))[^.]*$/igm );
								request.keys().forEach( key => request( key ) );

								require( `bundle?lazy!./${appName}/show/App.js` )( App => App.start( appName ) );
							}, "common" );
						}
					}
				} );

				Backbone.history.start();
			}
		}

		if ( __MOBILE__ ) {
			require( [ "cordova" ], () => document.addEventListener( "deviceready", start, false ) );
		}
		else {
			start();
		}
	}
	, popup( options ) {
		const Popup = options.Popup
			, popupRegion = this.currentLayout.PopupRegion;
		if ( !(popupRegion.currentView instanceof Popup) ) {
			popupRegion.show( new Popup( _.extend( options, { region: popupRegion } ) ) );
		}
		else {
			popupRegion.currentView.src = options.src;
			popupRegion.currentView.width = options.width;
			popupRegion.currentView.height = options.height;
			popupRegion.currentView.render();
		}
		popupRegion.$el.popup( "open" );
	}
	, toggleLoading( action, $this ) {
		if ( !$this ) $this = $(this);
		const theme = $this.jqmData( "theme" ) || $.mobile.loader.prototype.options.theme
			, msgText = $this.jqmData( "msgtext" ) || $.mobile.loader.prototype.options.text
			, textVisible = $this.jqmData( "textvisible" ) || $.mobile.loader.prototype.options.textVisible
			, textonly = !!$this.jqmData( "textonly" )
			, html = $this.jqmData( "html" ) || "";
		$.mobile.loading( action, {
			text: msgText,
			textVisible,
			theme,
			textonly,
			html
		} );
	}
} );

const _common = _appManager.module( "Common" );
_common.Module = Marionette.Module.extend( {
	startWithParent: false
} );

if ( __DEV__ ) window.AppManager = _appManager;
export default _appManager;