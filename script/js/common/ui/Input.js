const Input = React.forwardRef((props, ref) => (
  <input {...props} ref={ref} type="text" />
));

export default Input;
