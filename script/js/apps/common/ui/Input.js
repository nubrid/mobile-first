import _ from "lodash";

const Input = ( props ) => (
	<input { ..._.omit( props, [ "_ref" ] ) } ref={ props._ref } type="text" />
);
Input.propTypes = {
	_ref: React.PropTypes.func,
};

export default Input;