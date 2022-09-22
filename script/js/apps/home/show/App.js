/*
Home App
*/
export default {
	start( moduleName ) {
		const app = require( "apps/common/App" );
		app.Controller = require( "./Controller" );
		app.start( moduleName );
	}
};