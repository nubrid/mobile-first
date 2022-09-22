/*
Todos Show Controller
*/
export default ( id, callback ) => {
	const Controller = require( "apps/common/Controller" ).extend( { id, title: "Todos List", Main: require( "./View" ).Content } );
	callback( new Controller() );
};