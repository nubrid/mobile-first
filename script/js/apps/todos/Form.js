import Button from "common/ui/Button";
import Input from "common/ui/Input";
import { addTodo } from "common/entities/actions";

class ConnectedForm extends React.Component {
  state = {
    title: "",
    completed: false,
  };

  initialState = this.state;

  static propTypes = {
    addItem: PropTypes.func.isRequired,
  };

  handleCancelClick = () => {
    this.reset();
  };

  handleChange = event => {
    this.setState({ title: event.target.value });
  };

  handleSubmitClick = event => {
    event.preventDefault();

    const { title } = this.state;

    this.props.addItem({ title });
    this.setState(this.initialState);
  };

  render() {
    const { title } = this.state;
    return (
      <div>
        <label>Create a new Todo</label>
        <Input value={title} onChange={this.handleChange} />
        <Button onClick={this.handleSubmitClick}>Add</Button>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  addItem: item => dispatch(addTodo(item)),
});

const { connect } = ReactRedux,
  Form = connect(
    null,
    mapDispatchToProps,
  )(ConnectedForm);

export default Form;
