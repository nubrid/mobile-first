define([], function () {
	"use strict";
	var _CLASS_BODY = "ui-body-inherit"
		, _CLASS_BUTTON = "ui-btn"
		, _CLASS_BUTTON_ICON = "ui-btn-icon"
		, _CLASS_BUTTON_INHERIT = "ui-btn-inherit"
		, _CLASS_CHECKBOX = "ui-checkbox"
		, _CLASS_CORNER = "ui-corner-all"
		, _CLASS_GROUP = "ui-controlgroup"
		, _CLASS_ICON = "ui-icon"
		, _CLASS_ICON_DELETE = "ui-icon-delete"
		, _CLASS_ICON_NOTEXT = "ui-btn-icon-notext"
		, _CLASS_INPUT = "ui-input"
		, _CLASS_INPUT_CLEAR = "ui-input-clear"
		, _CLASS_INPUT_CLEAR_HIDDEN = "ui-input-clear-hidden"
		, _CLASS_INPUT_HAS_CLEAR = "ui-input-has-clear"
		, _CLASS_SHADOW = "ui-shadow"
		, _CLASS_SHADOW_INSET = "ui-shadow-inset";

	function _joinClass (className, classNames) {
		return (className
			? _.union(
				_.isArray(className)
					? className
					: [className]
				, classNames)
			: classNames)
			.join(" ");
	}
	
	function _extendProps (props, attrs, omitKeys) {
		return _.extend(_.omit(props, omitKeys), attrs);
	}
	
	function _ref (ref, proxy) {
		return $.proxy(function (refObj) { this[ref] = refObj; }, proxy);
	}

	function _button (props, value, el) {
		function getClassName (props) {
			var classNames = [_CLASS_BUTTON, _CLASS_CORNER, props.notext ? _CLASS_ICON_NOTEXT : _CLASS_SHADOW];
			if (props.align) classNames.push(_CLASS_BUTTON + "-" + props.align);
			if (props.icon) {
				classNames.push(_CLASS_ICON + "-" + props.icon);
				
				if (!props.notext) classNames.push(_CLASS_BUTTON_ICON + "-" + (props.align || "left"));
			}
			return _joinClass(props.className, classNames);
		}

		return React.DOM[el || "button"](_extendProps(props, { className: getClassName(props) }, ["align", "icon", "notext"]), value);
	}

	function _a (props, value) {
		return _button(props, value, "a");
	}
	
	function _checkbox (props, value) {
		function getClassName (props) {
			var classNames = [_CLASS_BUTTON, _CLASS_CORNER, _CLASS_BUTTON_INHERIT, _CLASS_BUTTON_ICON + "-left"];
			return _joinClass(props.className, classNames);
		}
	
		_.extend(props, {
			ref: props.ref
				? $.proxy(function (ref) {
                    $(ref).checkboxradio(); this(ref);
                }, props.ref)
				: function (ref) {
                    $(ref).checkboxradio();
                }
			, "data-enhanced": true
		});

		return React.DOM.div({ className: _CLASS_CHECKBOX }
			, React.DOM.label({ htmlFor: props.id, className: getClassName(props) }, value)
			, React.DOM.input(_.extend(props, { type: "checkbox" })));
	}

	function _group (props) {
		function getClassName (props) {
			var classNames = [_CLASS_CORNER, _CLASS_GROUP, _CLASS_GROUP + "-" + (props.type || "vertical")];
			return _joinClass(props.className, classNames);
		}
	
		_.extend(props, {
			ref: props.ref
				? $.proxy(function (ref) { $(ref).controlgroup(); this(ref); }, props.ref)
				: function (ref) { $(ref).controlgroup(); }
		});

		return React.DOM.div(_extendProps(props, { "data-role": "controlgroup", "data-type": props.type || "vertical", "data-enhanced": true, className: getClassName(props) }, ["title", "type"])
			, React.DOM.div({ role: "heading", className: _CLASS_GROUP + "-label" }
				, React.DOM.legend(null, props.title))
            /* jshint validthis: true */
			, React.DOM.div.apply(this, [{ className: [_CLASS_GROUP + "-controls"].join(" ") }].concat(_.rest(arguments))));
	}

	function _input (props, value) {
		function getClassName (props) {
			var classNames = [_CLASS_INPUT + "-" + (props.type || "text"), _CLASS_BODY, _CLASS_CORNER, _CLASS_SHADOW_INSET];
			if (props.hasClear !== false) classNames.push(_CLASS_INPUT_HAS_CLEAR);
			return _joinClass(props.className, classNames);
		}
	
		_.extend(props, {
			ref: props.ref
				? $.proxy(function (ref) { $(ref).textinput(); this(ref); }, props.ref)
				: function (ref) { $(ref).textinput(); }
			, "data-enhanced": true
		});

		var divProps = { className: getClassName(props) };
		if (props.hasClear !== false) {
			return React.DOM.div(divProps
				, React.DOM.input(_.extend(props, { "data-clear-btn": true }), value)
				, React.DOM.a({ href: "#", className: [_CLASS_INPUT_CLEAR, _CLASS_BUTTON, _CLASS_ICON_DELETE, _CLASS_ICON_NOTEXT, _CLASS_CORNER, _CLASS_INPUT_CLEAR_HIDDEN].join(" "), title: "Clear text" }, "Clear text"));
		}
		else {
			return React.DOM.div(divProps, React.DOM.input(props));
		}
	}

	return {
		ref: _ref
		, a: _a
		, button: _button
		, checkbox: _checkbox
		, group: _group
		, input: _input
	};
});