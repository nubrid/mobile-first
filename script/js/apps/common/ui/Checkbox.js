import _ from "lodash";

const Checkbox = ( props ) => (
	<div>
		<input { ..._.omit( props, [ "children" ] ) } type="checkbox" />
		<label htmlFor={ props.id }>{props.children}</label></div>
);
Checkbox.propTypes = {
	id: React.PropTypes.string,
	checked: React.PropTypes.bool,
	children: React.PropTypes.node,
};

export default Checkbox;