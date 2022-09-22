/*
Home App
*/
import CommonApp from "apps/common/App";

const HomeApp = ( props ) => ( // TODO: class HomeApp extends CommonApp { // TODO: React.Component {
	// TODO: constructor( props ) {
	// 	super( props );
	// 	this.state = {};
	// }
	// static defaultProps = {
	// 	View: require( "./View" )
	// }
	<CommonApp { ...props } View={ require( "./View" ) } />

	// TODO: componentDidMount() {
	// 	const Router = Backbone.Router.extend( {
	// 		routes: {
	// 			"": "show",
	// 			"home": "show",
	// 		},
	// 		show() {
	// 			const View = require( "./View" );

	// 			this.setState( { View } );
	// 		},
	// 	} );
	// 	const router = new Router();
	// 	router.navigate( "home", { trigger: true, replace: true } );
	// }

	// render() {
	// 	const View = this.state.View;

	// 	return View ? <View { ...this.props } /> : null;
	// }
);// }

export default HomeApp;
// TODO: import _app from "apps/common/App";
// import Controller from "./Controller";

// export default {
// export function start( moduleName ) {
	// const app = require( "apps/common/App" );
// 	_app.Controller = Controller; // require( "./Controller" );
// 	_app.start( moduleName );
// }
// };