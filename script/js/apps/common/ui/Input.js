import _ from "lodash";

const Input = ( props ) => { // TODO: const _input = React.createClass( {
	// TODO: displayName: "Input",
	// mixins: [ ReactPureRenderMixin ],
	// render() {
	// if ( _.includes( [ "button", "reset", "submit" ], props.type ) ) return (
	// 	<_inputButton { ...props } />
	// );

	// const type = props.type || "text"
	// 	, options = { enhanced: true };
	// if ( props.corners === false ) options.corners = false;

	// const refCallback = _getRefCallback( props.refCallback, "textinput", options );

	// const divProps = { className: _getClassName( { type, ...props }, `${_CLASS_INPUT}-${type}`, _CLASS_BODY, `${_CLASS_SHADOW}-inset` ) };
	// if ( props.hasClear !== false ) {
	// 	return (
	// 		<div { ...divProps }>
	// 			<input { ..._.omit( props, [ "type", "refCallback", "corners", "hasClear" ] ) } type={ type } ref={ refCallback } data-clear-btn={ true } value={ props.value } />
	// 			<a href="#" className={ `${_CLASS_INPUT}-clear ${_CLASS_BUTTON} ${_CLASS_ICON}-delete ${_CLASS_ICON_NOTEXT} ${_CLASS_CORNERS} ${_CLASS_INPUT}-clear-hidden` } title="Clear text">Clear text</a></div>
	// 	);
	// }
	// else {
	// 	return (
	// 		<div { ...divProps }><input { ...props } /></div>
	// 	);
	// }
	// },
	return (
		<input { ..._.omit( props, [ "_ref" ] ) } ref={ props._ref } type="text" />
	);
};// TODO: );
Input.propTypes = {
	_ref: React.PropTypes.func,
};

export default Input;