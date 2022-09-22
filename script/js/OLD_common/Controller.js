/*
Common Controller
*/
import _ from "lodash/fp";
import { Layout } from "./View";

export default class Controller {
	constructor( options ) {
		this.options = options;
		this.Layout = Layout;
	}

	show() {
		const page = AppManager.changePage( _.defaults( _.pick( this, [ "id", "title", "Main", "Layout" ] ), { dispatcher: AppManager.request( "dispatcher", this.id ) } ) );
		page.on( "all", function ( actionType, action ) {
			this.options.dispatcher.trigger( actionType, { actionType, action } );
		} );
	}
}