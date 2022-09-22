const Transition = ({
  children,
  "data-role": dataRole,
  transition = "slide",
  direction,
  ...props
}) => {
  props =
    dataRole === "page"
      ? {
          transitionName: "page",
          transitionEnterTimeout: 0,
          transitionLeaveTimeout: 0,
          transitionAppear: true,
          transitionAppearTimeout: 1000,
          ...props,
        }
      : props;
  // TODO: Check in common view.
  if (__MOBILE__) {
    class NativeTransition extends React.Component {
      componentWillAppear() {
        const options = {
          // "direction": "left", // 'left|right|up|down', default 'left' (which is like 'next')
          // "duration": 400, // in milliseconds (ms), default 400
          // "slowdownfactor": 4, // overlap views (higher number is more) or no overlap (1). -1 doesn't slide at all. Default 4
          // "slidePixels": 0, // optional, works nice with slowdownfactor -1 to create a 'material design'-like effect. Default not set so it slides the entire page.
          iosdelay: 100, // ms to wait for the iOS webview to update before animation kicks in, default 60
          androiddelay: 150, // same as above but for Android, default 70
          winphonedelay: 250, // same as above but for Windows Phone, default 200,
          fixedPixelsTop: 45, // the number of pixels of your fixed header, default 0 (iOS and Android)
          // "fixedPixelsBottom": 0, // the number of pixels of your fixed footer (f.i. a tab bar), default 0 (iOS and Android)
        };

        switch (transition) {
          case "slide":
            options.direction = direction;
            break;
        }

        window.plugins.nativepagetransitions[transition](options);
      }

      render() {
        return <span />;
      }
    }

    // TODO: Remove the need for extra span for transitionGroup
    return (
      <ReactTransitionGroup {...props}>
        {children}
        <NativeTransition />
      </ReactTransitionGroup>
    );
  } else {
    return (
      <ReactCSSTransitionGroup
        {...props}
        className={direction === "right" ? "bounceInRight" : "bounceInLeft"}
      >
        {children}
      </ReactCSSTransitionGroup>
    );
  }
};
Transition.propTypes = {
  children: PropTypes.node.isRequired,
  "data-role": PropTypes.string,
  direction: PropTypes.oneOf(["left", "right", "up", "down"]),
};
Transition.defaultProps = {
  direction: "left",
};

export default Transition;
