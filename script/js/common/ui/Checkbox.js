import CustomCheckbox from "@material-ui/core/Checkbox"
import FormControlLabel from "@material-ui/core/FormControlLabel"

const Checkbox = ({ children, ...props }) => (
  <FormControlLabel
    control={<CustomCheckbox {...props} type="checkbox" color="primary" />}
    label={children}
  />
)
Checkbox.propTypes = {
  id: PropTypes.string.isRequired,
  checked: PropTypes.bool,
  children: PropTypes.node.isRequired,
}

export default Checkbox
