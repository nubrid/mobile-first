/*
Common View
*/
import _ from "lodash/fp";
import A from "apps/common/ui/A";
// TODO: Specify another UI for Phonegap

export class Layout {
	constructor( options ) {
		const _Header = options.Header;
		if ( !( this.HeaderRegion.currentView instanceof _Header ) ) {
			this.HeaderRegion.show( new _Header( { region: this.HeaderRegion, title: options.title } ) );
		}
		else {
			this.HeaderRegion.currentView.title = options.title;
			this.HeaderRegion.currentView.render();
		}

		if ( options.Footer ) {
			const Footer = options.Footer;
			if ( !( this.FooterRegion.currentView instanceof Footer ) ) {
				this.FooterRegion.show( new Footer() );
				this.FooterRegion.$el.parent().toolbar();
			}
		}

		const Main = options.Main;
		if ( !( this.MainRegion.currentView instanceof Main ) ) this.MainRegion.show( new Main( _.defaults( _.pick( options, [ "id", "title", "dispatcher" ] ), { region: this.MainRegion } ) ) );

		this.PanelRegion.$el.panel();
		this.PopupRegion.$el.popup();

		return this;
	}
}

export class Header extends React.Component {
	static propTypes = {
		title: PropTypes.string,
	}

	componentDidMount() {
		// TODO: $( ReactDOM.findDOMNode( this ) ).toolbar();
	}

	render() {
		return (
			<div data-role="header" data-position="fixed" data-theme="a">
				<h1>{ this.props.title }</h1>
				<div>
					<A href="#PanelRegion" icon="bars" notext={ true } align="left">Panel</A>
					<A href="#home" icon="home" notext={ true } align="right">Home</A></div></div>
		);
	}
}

export class IFrame extends React.Component {
	static propTypes = {
		height: PropTypes.number,
		region: PropTypes.object,
		src: PropTypes.string,
		width: PropTypes.number,
	}

	constructor( props ) {
		super( props );
		this.parentEl = props.region ? props.region.$el[ 0 ] : this.el;
		this.src = props.src;
		this.width = props.width;
		this.height = props.height;
		this.seamless = "";
	}

	render() {
		this.view = ReactDOM.render( <iframe { ...this } />, this.parentEl );
		this.el = this.view.el;
		this.setElement( this.el );

		return null;
	}
}