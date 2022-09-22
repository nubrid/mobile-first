/*
Home Show View
*/
import { Content, UI } from "apps/common/View"; // jshint ignore:line
const Home = React.createClass( {
	displayName: "Home"
	, handleOpenBrowserClick() {
		this.props.view.trigger( "home:openBrowser", $( this.txtInput ).val() );
	}
	, handleLoginClick( event ) {
		const el = $( event.target );

		if ( el.closest( "a" ).length ) this.props.view.trigger( "home:login", event );
	}
	, render() {
		/* jshint ignore:start */
		return (
			<UI.page id={ this.props.id }>
				<UI.input refCallback={ UI.ref( "txtInput", this ) } />
				<UI.button onClick={ this.handleOpenBrowserClick }>Open Browser</UI.button>
				<UI.a href="#todos">Todos</UI.a>
				<UI.a href="#form">Form</UI.a>
				<div onClick={ this.handleLoginClick } className="social-media">
					<a href="#facebook" title="facebook" className="facebook">Facebook</a>
					<a href="#twitter" title="twitter" className="twitter">Twitter</a>
					<a href="#linkedin" title="linkedin" className="linkedin">LinkedIn</a></div></UI.page>
		);
		/* jshint ignore:end */
	}
} );

const Show = {};

Show.Content = Content.extend( {
	ReactClass: Home
} );

export default Show;