import * as actions from "common/entities/actions/chat"

import Button from "common/ui/Button"
import TextField from "common/ui/TextField"

class ConnectedForm extends React.Component {
  state = {
    title: "",
    completed: false,
  }

  initialState = this.state

  static propTypes = {
    addItem: PropTypes.func.isRequired,
  }

  handleCancelClick = () => {
    this.reset()
  }

  handleChange = event => {
    this.setState({ title: event.target.value })
  }

  handleSubmitClick = event => {
    event.preventDefault()

    const { title } = this.state

    this.props.addItem({ title })
    this.setState(this.initialState)
  }

  render() {
    const { title } = this.state
    return (
      <div>
        <TextField
          label="Create a new Chat"
          value={title}
          onChange={this.handleChange}
        />
        <Button onClick={this.handleSubmitClick}>Add</Button>
      </div>
    )
  }
}

const { connect } = ReactRedux,
  Form = connect(
    null,
    actions,
  )(ConnectedForm)

export default Form
