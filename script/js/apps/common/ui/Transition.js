import _ from "lodash";

const Transition = ( props ) => (
	<ReactCSSTransitionGroup
		{ ...props }
		{ ...(
			props[ "data-role" ] === "page"
				? { transitionName: "page", transitionEnterTimeout: 0, transitionLeaveTimeout: 0, transitionAppear: true, transitionAppearTimeout: 1000 }
				: null
		) }
		className={ `bounceIn${_.upperFirst( props.direction )}` }>

		{props.children}
	</ReactCSSTransitionGroup>
);
Transition.propTypes = {
	children: React.PropTypes.node,
	"data-role": React.PropTypes.string,
	direction: React.PropTypes.oneOf( [ "left", "right", "up", "down" ] ),
};
Transition.defaultProps = {
	direction: "left"
};

export default Transition;