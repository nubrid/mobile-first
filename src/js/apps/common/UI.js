define([], function () {
	"use strict";
	var _CLASS_BODY = "ui-body-inherit"
		, _CLASS_BUTTON = "ui-btn"
		, _CLASS_BUTTON_ICON = "ui-btn-icon"
		, _CLASS_CHECKBOX = "ui-checkbox"
		, _CLASS_CORNERS = "ui-corner-all"
		, _CLASS_GROUP = "ui-controlgroup"
		, _CLASS_ICON = "ui-icon"
		, _CLASS_ICON_NOTEXT = "ui-btn-icon-notext"
		, _CLASS_INPUT = "ui-input"
		, _CLASS_SHADOW = "ui-shadow";

	function _extendProps (props, attrs, omitKeys) {
		return _.extend(_.omit(props, omitKeys), attrs);
	}

	function _getClassName(props) {
		var classNames = _.rest(arguments);

		if (props.align) classNames.push(_CLASS_BUTTON + "-" + props.align);
		if (props.corners !== false) classNames.push(_CLASS_CORNERS);
		if (props.icon) {
			classNames.push(_CLASS_ICON + "-" + props.icon);

			if (!props.notext) classNames.push(_CLASS_BUTTON_ICON + "-" + (props.iconAlign || "left"));
		}
		if (props.type) {
			if (!_.contains(["reset", "submit", "vertical", "horizontal"], props.type)) {
				if (props.type === "button") classNames.push(_CLASS_INPUT + "-btn");
				else if (props.hasClear !== false) classNames.push(_CLASS_INPUT + "-has-clear");
			}
		}

		function joinClass (className, classNames) {
			return (className
			? _.union(
				_.isArray(className)
					? className
					: [className]
				, classNames)
			: classNames)
			.join(" ");
		}

		return joinClass(props.className, classNames);
	}

	function _getRefCallback (ref, widget, options) {
		return ref
			? $.proxy(function (ref) { $(ref)[widget](options); this(ref); }, ref)
			: function (ref) { $(ref)[widget](options); };
	}

	function _ref (ref, proxy) {
		return $.proxy(function (refObj) { this[ref] = refObj; }, proxy);
	}

	function _commonButton (props, el) {
		/* jshint validthis: true */
		return React.DOM[el].apply(this, [_extendProps(props
			, { className: _getClassName(props, _CLASS_BUTTON, props.notext ? _CLASS_ICON_NOTEXT : _CLASS_SHADOW) }
			, ["align", "corners", "icon", "iconAlign", "notext", "type"])
		].concat(_.rest(arguments, 2)));
	}

	function _a (props, value) {
		return _commonButton(props, "a", value);
	}

	function _button (props, value) {
		return _commonButton(props, "button", value);
	}

	function _checkbox (props, value) {
		var options = { enhanced: true };
		if (props.corners === false) options.corners = false;

		props.ref = _getRefCallback(props.ref, "checkboxradio", options);

		return React.DOM.div({ className: _CLASS_CHECKBOX }
			, React.DOM.label({ htmlFor: props.id, className: _getClassName(props, _CLASS_BUTTON, _CLASS_BUTTON + "-inherit", _CLASS_BUTTON_ICON + "-left", _CLASS_CHECKBOX + (props.defaultChecked ? "-on" : "-off")) }, value)
			, React.DOM.input(_extendProps(props, { type: "checkbox" }, ["corners"])));
	}

	function _group (props) {
		var options = {};
		var isDefault = true;
		if (props.corners === false) { options.corners = false; isDefault = false; }
		if (props.type === "horizontal") { options.type = props.type; isDefault = false; }

		if (isDefault) options.defaults = true;

		props.ref = _getRefCallback(props.ref, "controlgroup", options);

		var divArgs = [_extendProps(props, { "data-role": "controlgroup", className: _getClassName(props, _CLASS_GROUP, _CLASS_GROUP + "-" + (props.type || "vertical")) }, ["corners", "title", "type"])];

		if (props.title) divArgs.push(React.DOM.div({ role: "heading", className: _CLASS_GROUP + "-label" }, React.DOM.legend(null, props.title)));

		/* jshint validthis: true */
		return React.DOM.div.apply(this, divArgs.concat(_.rest(arguments)));
	}

	function _inputButton (props, value) {
		var options = { enhanced: true };
		if (props.corners === false) options.corners = false;
		if (props.icon) {
			options.icon = props.icon;
			if (props.notext) options.iconpos = "notext";
			else if (props.iconAlign && props.iconAlign !== "left") options.iconpos = props.iconAlign;
		}

		return _commonButton(_.omit(props, "ref"), "div", value, React.DOM.input({
			ref: _getRefCallback(props.ref, "button", options)
			, type: props.type
			, value: value }));
	}

	function _input (props, value) {
		if (_.contains(["button", "reset", "submit"], props.type)) return _inputButton(props, value);

		props.type = props.type || "text";

		var options = { enhanced: true };	
		if (props.corners === false) options.corners = false;

		props.ref = _getRefCallback(props.ref, "textinput", options);
		
		var divProps = { className: _getClassName(props, _CLASS_INPUT + "-" + props.type, _CLASS_BODY, _CLASS_SHADOW + "-inset") };
		if (props.hasClear !== false) {
			return React.DOM.div(divProps
				, React.DOM.input(_extendProps(props, { "data-clear-btn": true }, ["corners", "hasClear"]), value)
				, React.DOM.a({ href: "#", className: [_CLASS_INPUT + "-clear", _CLASS_BUTTON, _CLASS_ICON + "-delete", _CLASS_ICON_NOTEXT, _CLASS_CORNERS, _CLASS_INPUT + "-clear-hidden"].join(" "), title: "Clear text" }, "Clear text"));
		}
		else {
			return React.DOM.div(divProps, React.DOM.input(props));
		}
	}

	function _transition (props, contents) {
		if (window.phonegap) {
			var transitionGroup = React.createClass({
				componentWillAppear: function () {
					var options = {
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

					if (!props.transition) props.transition = "slide";
					switch (props.transition) {
						case "slide":
							options.direction = props.direction || "left";
							break;
					}

					window.plugins.nativepagetransitions[props.transition](
						options
						// , function (msg) {console.log("success: " + msg);} // called when the animation has finished
						// , function (msg) {alert("error: " + msg);} // called in case you pass in weird values
					);
				}
				, render: function () {
					return React.DOM.span();
				}
			});

			// TODO: Remove the need for extra span for transitionGroup
			return React.createElement(React.addons.TransitionGroup, AppManager.getTransition(_.omit(props, ["transition"])), contents, React.createElement(transitionGroup));
		}
		else {
			switch (props.direction) {
				case "right":
					props.className = "bounceInRight";
					break;
				default:
					props.className = "bounceInLeft";
			}

			return React.createElement(React.addons.CSSTransitionGroup, AppManager.getTransition(props), contents);
		}
	}

	function _page (props) {
		return _transition(_.extend(props, { "data-role": "page", component: "div" })
			/* jshint validthis: true */
			, React.DOM.div.apply(this, [{ role: "main", className: "ui-content" }].concat(_.rest(arguments)))
		);
	}

	return {
		ref: _ref
		, a: _a
		, button: _button
		, checkbox: _checkbox
		, group: _group
		, input: _input
		, page: _page
		, transition: _transition
	};
});