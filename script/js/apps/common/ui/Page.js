import Transition from "./Transition";

const Page = ( props ) => (
	<Transition { ...props } data-role="page" component="div"><div role="main" className="ui-content">{props.children}</div></Transition>
);
Page.propTypes = {
	children: React.PropTypes.node,
};

export default Page;