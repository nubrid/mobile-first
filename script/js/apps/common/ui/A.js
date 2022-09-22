const A = ( props ) => { // TODO: function _getButtonClass( name, omitKeys ) {
	// TODO: return React.createClass( {
	// 	displayName: name
	// 	, mixins: [ ReactPureRenderMixin ]
	// 	, render() {
	// 		const props = { className: _getClassName( props, _CLASS_BUTTON, props.notext ? _CLASS_ICON_NOTEXT : _CLASS_SHADOW ), ..._.omit( props, [ "align", "corners", "icon", "iconAlign", "notext", "type" ].concat( omitKeys ) ) };
	// 		switch ( name.toLowerCase() ) {
	// 			case "a":
	// 				return <a { ...props }>{ props.children }</a>;
	// 			case "button":
	// 				return <button { ...props }>{ props.children }</button>;
	// 			case "inputbutton":
	// 				return <div { ...props }>{ props.children }</div>;
	// 		}
	// 	}
	// } );
	return <a { ...props }>{ props.children }</a>;
};
A.propTypes = {
	children: React.PropTypes.node,
};

export default A;