import _ from "lodash";
import Button from "apps/common/ui/Button";
import Input from "apps/common/ui/Input";

export default class TodosForm extends React.Component {
	state = {
		id: -1,
		title: "",
		completed: false,
	}

	initialState = this.state;

	static propTypes = {
		actionType: React.PropTypes.object,
		collection: React.PropTypes.object,
		data: React.PropTypes.object,
		onReset: React.PropTypes.func,
	}

	reset = () => {
		this.isReset = true;
		this.props.onReset( this.initialState );
	}

	handleCancelClick = () => {
		this.reset();
	}

	handleChange = ( event ) => {
		this.setState( { title: event.target.value });
	}

	handleSubmitClick = () => {
		this.props.collection.dispatcher.trigger( this.state.id === -1 ? this.props.actionType.CREATE : this.props.actionType.UPDATE, { id: this.state.id, attrs: this.state });

		this.reset();
	}

	componentDidUpdate() {
		if ( this.isReset || ( this.props.data.id !== -1 && !_.isEqual( this.props.data, this.data ) ) ) {
			this.data = this.props.data;
			this.setState( this.isReset ? this.initialState : this.props.data );
			this.isReset = false;
		}
	}

	render() {
		return (
			<div>
				<label>{this.state.id !== -1 ? "Edit Todo" : "Create a new Todo"}</label>
				<Input value={ this.state.title } onChange={ this.handleChange } />
				<Button onClick={ this.handleSubmitClick }>{this.state.id !== -1 ? "Update" : "Add"}</Button>
				{this.state.id !== -1 ? <Button onClick={ this.handleCancelClick }>Cancel</Button> : null}</div>
		);
	}
}