/*
Todos Show View
*/
import AppManager from "apps/AppManager";
import { Content, UI } from "apps/common/View"; // jshint ignore:line
import { PureRenderMixin } from "entities/Common";
let List = {};

let _todos = React.createClass({
	displayName: "Todos"
	, getInitialState () {
		return { collection: null };
	}
	, handleFormReset( state ) {
		this.setState(state);
	}
	, handleListEdit( state ) {
		this.setState(state);
	}
	, componentDidMount () {
		// TODO: Update the query to be backend-agnostic
		let entity = AppManager.request("entity", { url: this.props.id, query: "{todos{id, title, completed}}", dispatcher: this.props.view.options.dispatcher });
		// this.props.view.dispatcher = entity.dispatcher; // Need to set this so that the Controller can properly dispatch.
		this.actionType = entity.actionType;

		$.when(entity.fetch).done(todos => this.setState({ collection: todos }));
	}
	, componentWillUnmount () {
		this.state.collection.close();
	}
	, render () {
		/* jshint ignore:start */
		return (
			<UI.page id={ this.props.id } direction="right">
				<List.React.TodosForm
					data={ _.omit(this.state, "collection") }
					actionType={ this.actionType }
					view={ this.props.view }
					onReset={ this.handleFormReset } />
				{ this.state.collection
				? <List.React.TodosList
					collection={ this.state.collection }
					view={ this.props.view }
					onEdit={ this.handleListEdit }/>
				: null }</UI.page>
		);
		/* jshint ignore:end */
	}
});

let _todosForm = React.createClass({
	displayName: "TodosForm"
	, getInitialState () {
		return {
			id: -1
			, title: ""
			, completed: false
		};
	}
	, reset () {
		this.isReset = true;
		this.props.onReset(this.getInitialState());
	}
	, handleCancelClick () {
		this.reset();
	}
	, handleChange( event ) {
		this.setState({ title: event.target.value });
	}
	, handleSubmitClick () {
		this.props.view.trigger(this.state.id === -1 ? this.props.actionType.CREATE : this.props.actionType.UPDATE, { id: this.state.id, attrs: this.state });

		this.reset();
	}
	, componentDidUpdate () {
		if (this.isReset || (this.props.data.id !== -1 && !_.isEqual(this.props.data, this.data))) {
			this.data = this.props.data;
			this[this.isReset ? "replaceState" : "setState"](this.props.data);
			this.isReset = false;
		}
	}
	, render () {
		/* jshint ignore:start */
		return (
			<div>
				<label>{ this.state.id !== -1 ? "Edit Todo" : "Create a new Todo" }</label>
				<UI.input value={ this.state.title } onChange={ this.handleChange } />
				<UI.button onClick={ this.handleSubmitClick }>{ this.state.id !== -1 ? "Update" : "Add" }</UI.button>
				{ this.state.id !== -1 ? <UI.button onClick={ this.handleCancelClick }>Cancel</UI.button> : null }</div>
		);
		/* jshint ignore:end */
	}
});

let _todosList = React.createClass({
	displayName: "TodosList"
	, mixins: [AppManager.BackboneMixin, PureRenderMixin]
	, handleItemClick( event ) {
		event.preventDefault();
		let el = $(event.target)
			, attrs = {};

		switch (el.text()) {
			case "Complete":
				let chkComplete = el.next("input");
				attrs = { completed: !chkComplete.prop("checked") };
				this.props.view.trigger(this.props.collection.actionType.UPDATE, { id: chkComplete.data("id"), attrs });
				break;
			case "Edit":
				let id = el.data("id");
				attrs = _.clone(this.props.collection.get(id).attributes);
				this.props.onEdit(_.defaults(attrs, { id }));
				break;
			case "Delete":
				this.props.view.trigger(this.props.collection.actionType.DELETE, { id: el.data("id") });
				break;
		}
	}
	, createItem( item ) { // jshint ignore:line
		/* jshint ignore:start */
		return (
			<List.React.TodosListItem key={ item.id } item={ item } onClick={ this.handleItemClick } />
		);
		/* jshint ignore:end */
	}
	, render () {
		/* jshint ignore:start */
		return <React.addons.CSSTransitionGroup { ...AppManager.Transition.ListItem }>{ this.props.collection.models.map(this.createItem) }</React.addons.CSSTransitionGroup>
		/* jshint ignore:end */
	}
});

let _todosListItem = React.createClass({
	displayName: "TodosListItem"
	, mixins: [PureRenderMixin]
	, render () {
		let item = this.props.item; // jshint ignore:line
		/* jshint ignore:start */
		return (
			<UI.group type="horizontal" title={ item.get("title") } onClick={ this.props.onClick }>
				<UI.checkbox id={ "chk_" + item.id } data-id={ item.id } checked={ item.get("completed") } onChange={ this.props.onClick } value="Complete" />
				<UI.button data-id={ item.id }>Edit</UI.button>
				<UI.button data-id={ item.id }>Delete</UI.button></UI.group>
		);
		/* jshint ignore:end */
	}
});

List.React = {
	Todos: _todos
	, TodosForm: _todosForm
	, TodosList: _todosList
	, TodosListItem: _todosListItem
};

List.Content = Content.extend({
	ReactClass: List.React.Todos
});

export default List;