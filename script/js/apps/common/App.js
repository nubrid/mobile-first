export default class CommonApp extends React.Component {
	state = {}

	static propTypes = {
		controller: React.PropTypes.object,
		name: React.PropTypes.string.isRequired,
		routes: React.PropTypes.object,
		View: React.PropTypes.any.isRequired,
	}

	componentDidMount() {
		const route = this.props.name === "home" ? "" : this.props.name
			, properties = {
				routes: this.props.routes || {
					[ route ]: "show",
				},
				show: () => {
					const View = this.props.View;

					this.setState( { View });
				},
				...this.props.controller,
			}
			, Router = Backbone.Router.extend( properties );
		new Router(); // eslint-disable-line no-new

		properties.show();
	}

	render() {
		const View = this.state.View;

		return View ? <View { ...this.props } /> : null;
	}
}