/*
Todos Show Controller
*/
import Controller from "apps/common/Controller";
import Main from "./View";

export default ( id, callback ) => {
	// TODO: const Controller = require( "apps/common/Controller" ).extend( { id, title: "Todos List", Main: require( "./View" ).Content } );
	// callback( new Controller() );
	callback( new Controller( {
		id,
		title: "Todos List",
		Main,
	} ) );
};