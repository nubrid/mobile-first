export default class Apps extends React.Component {
	state = {}

	unsubscribe = this.props.store.subscribe(() => this.setState( this.props.store.getState().app ) );

	static propTypes = {
		App: React.PropTypes.node,
		store: React.PropTypes.object,
	}

	componentDidMount() {
		const initRoute = ( name ) => {
			name = name || "home";

			require.ensure( [], require => {
				// TODO: const request = require.context( "./common", false, /^(.*\.(js$))[^.]*$/igm );
				// _.forEach( request.keys(), key => request( key ) );
				require( "./common" );

				require( `bundle?lazy!./${name}/index.js` )( App => this.props.store.dispatch( { type: "SET_APP", name, App }) ); // TODO: this.setState( { name, App } ) ); // HACK: Update ContextReplacementPlugin in case you change path
			}, "common" );
		};

		const Router = Backbone.Router.extend( {
			routes: {
				"": "initRoute",
				":mod(/)": "initRoute",
				":mod/:id(/)": "initRoute", // TODO: need to test!
			},
			initRoute,
		});

		new Router(); // eslint-disable-line no-new
		// TODO: Enable pushstate

		Backbone.history.start(); // TODO: { pushState: Modernizr.history } );
	}

	componentWillUnmount() {
		this.unsubscribe();
	}

	render() {
		const App = this.state.App; // TODO: this.state.App;

		return App ? <App name={ this.state.name } store={ this.props.store } /> : null;
	}
}