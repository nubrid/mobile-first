/*
Common App
*/
export default {
	start( moduleName, view ) {
		const appRoutes = {};
		view = view || "show";

		if ( moduleName === "home" ) _.extend( appRoutes, { "": view } );
		appRoutes[ moduleName ] = view;

		this.Controller( moduleName, controller => {
			/* jshint nonew: false */
			new Marionette.AppRouter( {
				appRoutes
				, controller
			} );

			controller[ view ]();
		} );
	}
};