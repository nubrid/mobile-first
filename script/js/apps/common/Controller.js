/*
Common Controller
*/
import _ from "lodash";
import { Layout } from "./View";

export default class Controller { // TODO: Marionette.Object.extend( {
	constructor( options ) { // TODO: initialize() {
		this.options = options;
		this.Layout = Layout; // TODO: require( "./View" ).Layout;
	}// TODO: ,

	show() { // TODO: show() {
		const page = AppManager.changePage( _.defaults( _.pick( this, [ "id", "title", "Main", "Layout" ] ), { dispatcher: AppManager.request( "dispatcher", this.id ) } ) );
		page.on( "all", function ( actionType, action ) {
			this.options.dispatcher.trigger( actionType, { actionType, action } );
		} );
	}
}// TODO: );