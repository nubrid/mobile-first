/*
Todos App
*/
import CommonApp from "apps/common/App";

const TodosApp = ( props ) => (
	<CommonApp { ...props } View={ require( "./View" ) } />
);

export default TodosApp;
// TODO: export default {
// 	start( moduleName ) {
// 		const app = require( "apps/common/App" );
// 		app.Controller = require( "./Controller" );
// 		app.start( moduleName );
// 	}
// };