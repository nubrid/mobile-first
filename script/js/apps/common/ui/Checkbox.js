import _ from "lodash";

const Checkbox = ( props ) => { // TODO: _checkbox = React.createClass( {
	// TODO: displayName: "Checkbox",
	// mixins: [ ReactPureRenderMixin ],
	// render() {
	// 	const options = { enhanced: true };
	// 	if ( props.corners === false ) options.corners = false;

	// 	return (
	// 		<div className={ _CLASS_CHECKBOX }>
	// 			<label htmlFor={ props.id } className={ _getClassName( props, _CLASS_BUTTON, `${_CLASS_BUTTON}-inherit`, `${_CLASS_BUTTON_ICON}-left`, `${_CLASS_CHECKBOX}-${props.checked ? "on" : "off"}` ) }>{ props.value }</label>
	// 			<input { ..._.omit( props, [ "corners", "value" ] ) } type="checkbox" ref={ _getRefCallback( props.refCallback, "checkboxradio", options ) } /></div>
	// 	);
	// }
	return (
		<div>
			<input { ..._.omit( props, [ "children" ] ) } type="checkbox" />
			<label htmlFor={ props.id }>{ props.children }</label></div>
	);
};// TODO: );
Checkbox.propTypes = {
	id: React.PropTypes.string,
	checked: React.PropTypes.bool,
	children: React.PropTypes.node,
};

export default Checkbox;