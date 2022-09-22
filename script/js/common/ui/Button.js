import CustomButton from "@material-ui/core/Button"

const Button = ({ children, ...props }) => (
  <CustomButton {...props} variant="contained" color="primary">
    {children}
  </CustomButton>
)
Button.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Button
