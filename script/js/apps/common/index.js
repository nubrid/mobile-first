/*
AppManager
*/
export { default as App } from "./App";
export { default as Dispatcher } from "./Dispatcher";
export { default as Entities } from "./Entities";
export { default as ui } from "./ui";

export const url = !!__URL__ ? __URL__ : `${document.location.protocol}//${document.location.host}`; // eslint-disable-line no-extra-boolean-cast

// TODO: export const transition = {
// 	listItem: { transitionName: "list-item", transitionEnterTimeout: 500, transitionLeaveTimeout: 500 }
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