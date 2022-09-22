const Checkbox = ({ children, ...props }) => (
  <>
    <input {...props} type="checkbox" />
    <label htmlFor={props.id}>{children}</label>
  </>
);
Checkbox.propTypes = {
  id: PropTypes.string.isRequired,
  checked: PropTypes.bool,
  children: PropTypes.node.isRequired,
};

export default Checkbox;
