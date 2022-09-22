const A = ({ children, ...props }) => <a {...props}>{children}</a>;
A.propTypes = {
  children: PropTypes.node.isRequired,
};

export default A;
