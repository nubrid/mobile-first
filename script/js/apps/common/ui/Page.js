import Transition from "./Transition";

const Page = ( props ) => { // TODO: const _page = React.createClass( {
	// TODO: displayName: "Page",
	// mixins: [ ReactPureRenderMixin ],
	// render() {
	return (
		<Transition { ...props } data-role="page" component="div"><div role="main" className="ui-content">{ props.children }</div></Transition>
	);
	// }// TODO: ,
};// TODO: );
Page.propTypes = {
	children: React.PropTypes.node,
};

export default Page;