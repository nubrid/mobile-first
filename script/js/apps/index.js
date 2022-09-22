/*
Apps
*/
export default class Apps extends React.Component {
	state = {}

	componentDidMount() {
		const initRoute = ( name ) => {
			name = name || "home";

			require.ensure( [], require => {
				// TODO: const request = require.context( "./common", false, /^(.*\.(js$))[^.]*$/igm );
				// _.forEach( request.keys(), key => request( key ) );
				require( "./common" );

				require( `bundle?lazy!./${name}/index.js` )( App => this.setState( { name, App } ) ); // HACK: Update ContextReplacementPlugin in case you change path
			}, "common" );
		};

		const Router = Backbone.Router.extend( {
			routes: {
				"": "initRoute",
				":mod(/)": "initRoute",
				":mod/:id(/)": "initRoute", // TODO: need to test!
			},
			initRoute,
		} );

		new Router(); // eslint-disable-line no-new
		// TODO: Enable pushstate
		Backbone.history.start(); // TODO: { pushState: Modernizr.history } );
	}

	render() {
		const App = this.state.App;

		return App ? <App name={this.state.name} /> : null;
	}
}

// TODO: const _appManager = new Marionette.Application( {
// export const Transition = {
// 	ListItem: { transitionName: "list-item", transitionEnterTimeout: 500, transitionLeaveTimeout: 500 }
// };

// export function changePage( options ) {
// 	this.currentLayout = this.currentLayout && ( this.currentLayout instanceof options.Layout )
// 		? this.currentLayout.initialize( options )
// 		: new options.Layout( options );
// 	$.mobile.initializePage();

// 	if ( options.id ) this.navigate( options.id );

// 	return this.currentLayout.MainRegion.currentView;
// }

// export function currentRoute() {
// 	return Backbone.history.fragment;
// }

// export function navigate( route, options ) {
// 	Backbone.history.navigate( route, options );
// }

// export function net( callback ) {
	// function isDeviceOnline() {
	// 	return navigator.connection
	// 		&& ( navigator.connection.type === Connection.WIFI
	// 			|| navigator.connection.type === Connection.CELL_2G
	// 			|| navigator.connection.type === Connection.CELL_3G
	// 			|| navigator.connection.type === Connection.CELL_4G
	// 			|| navigator.connection.type === Connection.CELL
	// 			|| navigator.connection.type === Connection.ETHERNET
	// 			|| navigator.connection.type === Connection.UNKNOWN );
	// }

// 	if ( navigator.connection
// 		&& ( navigator.connection.type === Connection.WIFI
// 			|| navigator.connection.type === Connection.CELL_2G
// 			|| navigator.connection.type === Connection.CELL_3G
// 			|| navigator.connection.type === Connection.CELL_4G
// 			|| navigator.connection.type === Connection.CELL
// 			|| navigator.connection.type === Connection.ETHERNET
// 			|| navigator.connection.type === Connection.UNKNOWN ) ) {
// 		callback();
// 	}
// 	else {
// 		this.request( "connect", { callback, closeOnOpen: true } );
// 	}
// }

// , onStart() {
	// Marionette.Region.prototype.attachHtml = () => { };

// function _start() {
// 	if ( Backbone.history ) {
		// $( ".back" ).on( "click", function () {
		// 	window.history.back();
		// 	return false;
		// } );

// 		const Router = Backbone.Router.extend( { // TODO: new Marionette.AppRouter( {
// 			routes: { // TODO: appRoutes: {
// 				"": "initRoute"
// 				, ":mod(/)": "initRoute"
// 				, ":mod/:id(/)": "initRoute" // TODO: need to test!
// 			}
// 			, // TODO: controller: {
// 				initRoute( name ) {
// 					const appName = name || "home";

// 					require.ensure( [], require => {
// 						const request = require.context( "./common", false, /^(.*\.(js$))[^.]*$/igm );
// 						request.keys().forEach( key => request( key ) );

// 						require( `bundle?lazy!./${appName}/index.js` )( App => App.start( appName ) ); // HACK: Update ContextReplacementPlugin in case you change path
// 					}, "common" );
// 				}
// 			// TODO: }
// 		} );

// 		new Router();
// 		Backbone.history.start( { pushState: Modernizr.history } );
// 	}
// }

// export function start () {
// 	if ( __MOBILE__ ) {
// 		require( [ "cordova" ], () => document.addEventListener( "deviceready", _start, false ) );
// 	}
// 	else {
// 		_start();
// 	}
// }

// export function popup( options ) {
// 	const Popup = options.Popup
// 		, popupRegion = this.currentLayout.PopupRegion;
// 	if ( !( popupRegion.currentView instanceof Popup ) ) {
// 		popupRegion.show( new Popup( { ...options, region: popupRegion } ) );
// 	}
// 	else {
// 		popupRegion.currentView.src = options.src;
// 		popupRegion.currentView.width = options.width;
// 		popupRegion.currentView.height = options.height;
// 		popupRegion.currentView.render();
// 	}
// 	popupRegion.$el.popup( "open" );
// }

// export function toggleLoading( action, $this ) {
// 	if ( !$this ) $this = $( this );
// 	const theme = $this.jqmData( "theme" ) || $.mobile.loader.prototype.options.theme
// 		, msgText = $this.jqmData( "msgtext" ) || $.mobile.loader.prototype.options.text
// 		, textVisible = $this.jqmData( "textvisible" ) || $.mobile.loader.prototype.options.textVisible
// 		, textonly = !!$this.jqmData( "textonly" )
// 		, html = $this.jqmData( "html" ) || "";
// 	$.mobile.loading( action, {
// 		text: msgText,
// 		textVisible,
// 		theme,
// 		textonly,
// 		html
// 	});
// }
// }; );

// const _common = _appManager.module( "Common" );
// _common.Module = Marionette.Module.extend( {
// 	startWithParent: false
// } );

// if ( __DEV__ ) window.AppManager = _appManager;
// export default _appManager;