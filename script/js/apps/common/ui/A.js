const A = ( props ) => (
	<a { ...props }>{props.children}</a>
);
A.propTypes = {
	children: React.PropTypes.node,
};

export default A;