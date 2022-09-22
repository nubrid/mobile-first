/*
Common App
*/
// TODO: export default {
export default class CommonApp extends React.Component { // TODO: export function start( moduleName, view ) {
	// TODO: const routes = {}; // TODO: const appRoutes = {};
	// view = view || "show";

	// if ( moduleName === "home" ) routes = { ...routes, "": view }; // TODO: _.extend( appRoutes, { "": view } );
	// routes[ moduleName ] = view; // TODO: appRoutes[ moduleName ] = view;
	state = {}

	static propTypes = {
		controller: React.PropTypes.object,
		name: React.PropTypes.string.isRequired,
		routes: React.PropTypes.object,
		View: React.PropTypes.any.isRequired,
	}

	componentDidMount() { // TODO: this.Controller( moduleName, controller => {
		const route = this.props.name === "home" ? "" : this.props.name
			, properties = { // TODO: _.extend(
				routes: this.props.routes || {
					[ route ]: "show",
				},
				show: () => {
					const View = this.props.View;

					this.setState( { View } );
				},
				...this.props.controller,
			}// TODO: )
			, Router = Backbone.Router.extend( properties ); // TODO: { new Backbone.Router.extend( { // TODO: new Marionette.AppRouter( {
				// TODO: routes: this.props.routes || {
				// 	[ route ]: "show",
				// }, // TODO: appRoutes
				// controller: this.props.controller || {
				// 	show() {
				// 		const View = this.props.View;

				// 		this.setState( { View } );
				// 	},
				// },
			// } );
		new Router(); // eslint-disable-line no-new
		// TODO: router.navigate( route, { trigger: true, replace: this.props.name === "home" } );
		properties.show();

		// TODO: controller[ view ]();
	}// TODO: );

	render() {
		const View = this.state.View;

		return View ? <View { ...this.props } /> : null;
	}
}
// TODO: };