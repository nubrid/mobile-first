import CustomInput from "@material-ui/core/Input"

const Input = React.forwardRef((props, ref) => (
  <CustomInput {...props} ref={ref} />
))

export default Input
