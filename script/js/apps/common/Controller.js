/*
Common Controller
*/
export default Marionette.Object.extend( {
	initialize() {
		this.Layout = require( "./View" ).Layout;
	}
	, show() {
		const page = AppManager.changePage( _.defaults( _.pick( this, "id", "title", "Main", "Layout" ), { dispatcher: AppManager.request( "dispatcher", this.id ) } ) );
		page.on( "all", function ( actionType, action ) {
			this.options.dispatcher.trigger( actionType, { actionType, action } );
		} );
	}
} );