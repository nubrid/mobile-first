/*
Common UI
*/
const _CLASS_BODY = "ui-body-inherit"
	, _CLASS_BUTTON = "ui-btn"
	, _CLASS_BUTTON_ICON = "ui-btn-icon"
	, _CLASS_CHECKBOX = "ui-checkbox" // jshint ignore:line
	, _CLASS_CORNERS = "ui-corner-all"
	, _CLASS_GROUP = "ui-controlgroup" // jshint ignore:line
	, _CLASS_ICON = "ui-icon"
	, _CLASS_ICON_NOTEXT = "ui-btn-icon-notext"
	, _CLASS_INPUT = "ui-input"
	, _CLASS_SHADOW = "ui-shadow";

function _getClassName( props ) {
	const classNames = _.rest( arguments );

	if ( props.align ) classNames.push( `${_CLASS_BUTTON}-${props.align}` );
	if ( props.corners !== false ) classNames.push( _CLASS_CORNERS );
	if ( props.icon ) {
		classNames.push( `${_CLASS_ICON}-${props.icon}` );

		if ( !props.notext ) classNames.push( `${_CLASS_BUTTON_ICON}-${props.iconAlign || "left"}` );
	}
	if ( props.type ) {
		if ( !_.contains( [ "reset", "submit", "vertical", "horizontal" ], props.type ) ) {
			if ( props.type === "button" ) classNames.push( `${_CLASS_INPUT}-btn` );
			else if ( props.hasClear !== false ) classNames.push( `${_CLASS_INPUT}-has-clear` );
		}
	}

	function joinClass( className, classNames ) {
		return ( className
			? _.union(
				_.isArray( className )
					? className
					: [ className ]
				, classNames )
			: classNames
		)
		.join( " " );
	}

	return joinClass( props.className, classNames );
}

function _getRefCallback( ref, widget, options ) {
	return el => {
		if ( el ) $( el )[ widget ]( options );
		if ( ref ) ref( el );
	};
}

function _getButtonClass( name, omitKeys ) {
	return React.createClass( {
		displayName: name
		, mixins: [ ReactPureRenderMixin ]
		, render() {
			const props = _.extend( { className: _getClassName( this.props, _CLASS_BUTTON, this.props.notext ? _CLASS_ICON_NOTEXT : _CLASS_SHADOW ) }, _.omit( this.props, [ "align", "corners", "icon", "iconAlign", "notext", "type" ].concat( omitKeys ) ) ); // jshint ignore:line
			/* jshint ignore:start */
			switch ( name.toLowerCase() ) {
				case "a":
					return <a { ...props }>{ this.props.children }</a>;
				case "button":
					return <button { ...props }>{ this.props.children }</button>;
				case "inputbutton":
					return <div { ...props }>{ this.props.children }</div>;
			}
			/* jshint ignore:end */
		}
	} );
}

const _a = _getButtonClass( "A" );

const _button = _getButtonClass( "Button" );

const _checkbox = React.createClass( {
	displayName: "Checkbox"
	, mixins: [ ReactPureRenderMixin ]
	, render() {
		const options = { enhanced: true };
		if ( this.props.corners === false ) options.corners = false;

		/* jshint ignore:start */
		return (
			<div className={ _CLASS_CHECKBOX }>
				<label htmlFor={ this.props.id } className={ _getClassName( this.props, _CLASS_BUTTON, `${_CLASS_BUTTON}-inherit`, `${_CLASS_BUTTON_ICON}-left`, `${_CLASS_CHECKBOX}-${this.props.checked ? "on" : "off"}` ) }>{ this.props.value }</label>
				<input { ..._.omit( this.props, [ "corners", "value" ] ) } type="checkbox" ref={ _getRefCallback( this.props.refCallback, "checkboxradio", options ) } /></div>
		);
		/* jshint ignore:end */
	}
} );

const _group = React.createClass( {
	displayName: "Group"
	, mixins: [ ReactPureRenderMixin ]
	, render() {
		const options = {};
		let isDefault = true;
		if ( this.props.corners === false ) { options.corners = false; isDefault = false; }
		if ( this.props.type === "horizontal" ) { options.type = this.props.type; isDefault = false; }

		if ( isDefault ) options.defaults = true;

		/* jshint ignore:start */
		return (
			<div { ..._.omit( this.props, [ "type", "reffCallback", "corners", "title" ] ) } ref={ _getRefCallback( this.props.refCallback, "controlgroup", options ) } data-role="controlgroup" className={ _getClassName( this.props, _CLASS_GROUP, `${_CLASS_GROUP}-${this.props.type || "vertical"}` ) }>
				{ this.props.title ? <div role="heading" className={ `${_CLASS_GROUP}-label` }><legend>{ this.props.title }</legend></div> : null }
				{ this.props.children }</div>
		);
		/* jshint ignore:end */
	}
} );

function _inputButton( props ) { // jshint ignore:line
	const options = { enhanced: true };
	if ( props.corners === false ) options.corners = false;
	if ( props.icon ) {
		options.icon = props.icon;
		if ( props.notext ) options.iconpos = "notext";
		else if ( props.iconAlign && props.iconAlign !== "left" ) options.iconpos = props.iconAlign;
	}

	const InputButton = _getButtonClass( "InputButton", [ "ref" ] ); // jshint ignore:line

	/* jshint ignore:start */
	return (
		<InputButton>
			<input ref={ _getRefCallback( props.ref, "button", options ) } type={ props.type } value={ props.value } /></InputButton>
	);
	/* jshint ignore:end */
}

const _input = React.createClass( {
	displayName: "Input"
	, mixins: [ ReactPureRenderMixin ]
	, render() {
		/* jshint ignore:start */
		if ( _.contains( [ "button", "reset", "submit" ], this.props.type ) ) return (
			<_inputButton { ...this.props } />
		);
		/* jshint ignore:end */

		const type = this.props.type || "text"
			, options = { enhanced: true };
		if ( this.props.corners === false ) options.corners = false;

		const refCallback = _getRefCallback( this.props.refCallback, "textinput", options ); // jshint ignore:line

		const divProps = { className: _getClassName( _.extend( { type }, this.props ), `${_CLASS_INPUT}-${type}`, _CLASS_BODY, `${_CLASS_SHADOW}-inset` ) }; // jshint ignore:line
		if ( this.props.hasClear !== false ) {
			/* jshint ignore:start */
			return (
				<div { ...divProps }>
					<input { ..._.omit( this.props, [ "type", "refCallback", "corners", "hasClear" ] ) } type={ type } ref={ refCallback } data-clear-btn={ true } value={ this.props.value } />
					<a href="#" className={ `${_CLASS_INPUT}-clear ${_CLASS_BUTTON} ${_CLASS_ICON}-delete ${_CLASS_ICON_NOTEXT} ${_CLASS_CORNERS} ${_CLASS_INPUT}-clear-hidden` } title="Clear text">Clear text</a></div>
			);
			/* jshint ignore:end */
		}
		else {
			/* jshint ignore:start */
			return (
				<div { ...divProps }><input { ...props } /></div>
			);
			/* jshint ignore:end */
		}
	}
} );

function _transition( props ) {
	const transitionProps = props[ "data-role" ] === "page" ? _.extend( { transitionName: "page", transitionEnterTimeout: 0, transitionLeaveTimeout: 0, transitionAppear: true, transitionAppearTimeout: 1000 }, props ) : props; // jshint ignore:line
	// TODO: Check in common view.
	if ( __MOBILE__ ) {
		const NativeTransition = React.createClass( { // jshint ignore:line
			componentWillAppear() {
				const options = {
					// "direction": "left" // 'left|right|up|down', default 'left' (which is like 'next')
					// , "duration": 400 // in milliseconds (ms), default 400
					// "slowdownfactor": 4 // overlap views (higher number is more) or no overlap (1). -1 doesn't slide at all. Default 4
					// , "slidePixels": 0 // optional, works nice with slowdownfactor -1 to create a 'material design'-like effect. Default not set so it slides the entire page.
					"iosdelay": 100 // ms to wait for the iOS webview to update before animation kicks in, default 60
					, "androiddelay": 150 // same as above but for Android, default 70
					, "winphonedelay": 250 // same as above but for Windows Phone, default 200,
					, "fixedPixelsTop": 45 // the number of pixels of your fixed header, default 0 (iOS and Android)
					// , "fixedPixelsBottom": 0 // the number of pixels of your fixed footer (f.i. a tab bar), default 0 (iOS and Android)
				};

				const transition = props.transition || "slide";
				switch ( transition ) {
					case "slide":
						options.direction = props.direction || "left";
						break;
				}

				window.plugins.nativepagetransitions[ transition ](
					options
					// , function (msg) {console.log("success: " + msg);} // called when the animation has finished
					// , function (msg) {alert("error: " + msg);} // called in case you pass in weird values
				);
			}
			, render() {
				/* jshint ignore:start */
				return <span />;
				/* jshint ignore:end */
			}
		} );

		// TODO: Remove the need for extra span for transitionGroup
		/* jshint ignore:start */
		return (
			<ReactTransitionGroup { ...transitionProps }>
				{ props.children }
				<NativeTransition />
			</ReactTransitionGroup>
		);
		/* jshint ignore:end */
	}
	else {
		const _className = props.direction === "right" ? "bounceInRight" : "bounceInLeft"; // jshint ignore:line 

		/* jshint ignore:start */
		return (
			<ReactCSSTransitionGroup { ...props } { ...transitionProps } className={ _className }>
				{ props.children }
			</ReactCSSTransitionGroup>
		);
		/* jshint ignore:end */
	}
}

const _page = React.createClass( {
	displayName: "Page"
	, mixins: [ ReactPureRenderMixin ]
	, render() {
		/* jshint ignore:start */
		return (
			<_transition { ...this.props } data-role="page" component="div"><div role="main" className="ui-content">{ this.props.children }</div></_transition>
		);
		/* jshint ignore:end */
	}
} );

export default {
	ref: ( ref, proxy ) => refObj => proxy[ ref ] = refObj
	, a: _a
	, button: _button
	, checkbox: _checkbox
	, group: _group
	, input: _input
	, page: _page
	, transition: _transition
};