const Button = ({ children, ...props }) => (
  <button {...props}>{children}</button>
);
Button.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Button;
