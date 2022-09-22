const Button = ( props ) => (
	<button { ...props }>{props.children}</button>
);
Button.propTypes = {
	children: React.PropTypes.node,
};

export default Button;