/*
Todos View
*/
// TODO: import { Content, UI } from "apps/common/View";
// TODO: import UI from "apps/common/UI";
import _ from "lodash";
import Dispatcher from "apps/common/Dispatcher";
import { getEntity } from "apps/common/Entities";
import Form from "./Form";
import List from "./List";
import Page from "apps/common/ui/Page";

// // TODO: const List = {};
// // TODO: const _todosForm = React.createClass( {
// class TodosForm extends React.Component {
// 	// TODO: displayName: "TodosForm",
// 	// getInitialState() {
// 	// 	return {
// 	// 		id: -1
// 	// 		, title: ""
// 	// 		, completed: false
// 	// 	};
// 	// },
// 	constructor( props ) {
// 		super( props );
// 		this.state = {
// 			id: -1,
// 			title: "",
// 			completed: false,
// 		};
// 	}

// 	reset = () => {
// 		this.isReset = true;
// 		this.props.onReset( this.getInitialState() );
// 	}// TODO: ,

// 	handleCancelClick = () => {
// 		this.reset();
// 	}// TODO: ,

// 	handleChange = ( event ) => {
// 		this.setState( { title: event.target.value } );
// 	}// TODO: ,

// 	handleSubmitClick = () => {
// 		this.props.view.trigger( this.state.id === -1 ? this.props.actionType.CREATE : this.props.actionType.UPDATE, { id: this.state.id, attrs: this.state } );

// 		this.reset();
// 	}// TODO: ,

// 	componentDidUpdate() {
// 		if ( this.isReset || ( this.props.data.id !== -1 && !_.isEqual( this.props.data, this.data ) ) ) {
// 			this.data = this.props.data;
// 			this[ this.isReset ? "replaceState" : "setState" ]( this.props.data );
// 			this.isReset = false;
// 		}
// 	}// TODO: ,

// 	render() {
// 		return (
// 			<div>
// 				<label>{ this.state.id !== -1 ? "Edit Todo" : "Create a new Todo" }</label>
// 				<Input value={ this.state.title } onChange={ this.handleChange } />
// 				<Button onClick={ this.handleSubmitClick }>{ this.state.id !== -1 ? "Update" : "Add" }</Button>
// 				{ this.state.id !== -1 ? <Button onClick={ this.handleCancelClick }>Cancel</Button> : null }</div>
// 		);
// 	}// TODO: ,
// }// TODO: );

// // TODO: const _todosListItem = React.createClass( {
// class TodosListItem extends React.Component {
// 	// TODO: displayName: "TodosListItem",
// 	// mixins: [ BackboneImmutable.PureRenderMixin ],
// 	constructor( props ) {
// 		super( props );
// 		this.shouldComponentUpdate = BackboneImmutable.PureRenderMixin.shouldComponentUpdate.bind( this );
// 	}

// 	render() {
// 		const item = this.props.item;
// 		return (
// 			<Group type="horizontal" title={ item.get( "title" ) } onClick={ this.props.onClick }>
// 				<Checkbox id={ `chk_${item.id}` } data-id={ item.id } checked={ item.get( "completed" ) } onChange={ this.props.onClick } value="Complete" />
// 				<Button data-id={ item.id }>Edit</Button>
// 				<Button data-id={ item.id }>Delete</Button></Group>
// 		);
// 	}// TODO: ,
// }// TODO: );

// // TODO: const _todosList = React.createClass( {
// class TodosList extends React.Component {
// 	// TODO: displayName: "TodosList",
// 	// mixins: [ BackboneReactMixin, BackboneImmutable.PureRenderMixin ],
// 	constructor( props ) {
// 		super( props );
// 		BackboneReactMixin.on( this, {
// 			collections: {
// 				collection: this.props.collection
// 			}
// 		} );
// 		this.shouldComponentUpdate = BackboneImmutable.PureRenderMixin.shouldComponentUpdate.bind( this );
// 	}

// 	componentWillUnmount() {
// 		BackboneReactMixin.off( this );
// 	}

// 	handleItemClick = ( event ) => {
// 		event.preventDefault();
// 		const el = $( event.target );
// 		let attrs = {};

// 		switch ( el.text() ) {
// 			case "Complete":
// 				const chkComplete = el.next( "input" );
// 				attrs = { completed: !chkComplete.prop( "checked" ) };
// 				this.props.view.trigger( this.props.collection.actionType.UPDATE, { id: chkComplete.data( "id" ), attrs } );
// 				break;
// 			case "Edit":
// 				const id = el.data( "id" );
// 				attrs = _.clone( this.props.collection.get( id ).attributes );
// 				this.props.onEdit( _.defaults( attrs, { id } ) );
// 				break;
// 			case "Delete":
// 				this.props.view.trigger( this.props.collection.actionType.DELETE, { id: el.data( "id" ) } );
// 				break;
// 		}
// 	}// TODO: ,

// 	createItem = ( item ) => {
// 		return (
// 			// TODO: <List.React.TodosListItem key={ item.id } item={ item } onClick={ this.handleItemClick } />
// 			<TodosListItem key={ item.id } item={ item } onClick={ this.handleItemClick } />
// 		);
// 	}// TODO: ,

// 	render() {
// 		return <ReactCSSTransitionGroup { ...AppManager.transition.listItem }>{ this.props.collection.models.map( this.createItem ) }</ReactCSSTransitionGroup>
// 	}// TODO: ,
// }// TODO: );

export default class TodosView extends React.Component { // TODO: const _todos = React.createClass( {
	// TODO: displayName: "Todos",
	// getInitialState() {
	// 	return { collection: null };
	// },
	state = { collection: null }

	static propTypes = {
		name: React.PropTypes.string.isRequired,
	}

	handleFormReset = ( state ) => {
		this.setState( state );
	}// TODO: ,

	handleListEdit = ( state ) => {
		this.setState( state );
	}// TODO: ,

	componentDidMount() {
		// TODO: const entity = AppManager.request( "entity", { url: this.props.name, query: "{todos{id, title, completed}}", dispatcher: this.props.view.options.dispatcher } );
		// this.props.view.dispatcher = entity.dispatcher; // Need to set this so that the Controller can properly dispatch.
		// this.actionType = entity.actionType;

		// $.when( entity.fetch ).done( todos => this.setState( { collection: todos } ) );

		// TODO: Update the query to be backend-agnostic
		getEntity( { url: this.props.name, query: "{todos{id, title, completed}}", dispatcher: new Dispatcher() }).then( result => {
			this.actionType = result.actionType;
			this.setState( { collection: result.data });
		});
	}// TODO: ,

	componentWillUnmount() {
		this.state.collection.close();
	}// TODO: ,

	render() {
		return (
			// TODO: <Page id={ this.props.id } direction="right">
			// 	<List.React.TodosForm
			// 		data={ _.omit( this.state, [ "collection" ] ) }
			// 		actionType={ this.actionType }
			// 		view={ this.props.view }
			// 		onReset={ this.handleFormReset } />
			// 	{ this.state.collection
			// 	? <List.React.TodosList
			// 		collection={ this.state.collection }
			// 		view={ this.props.view }
			// 		onEdit={ this.handleListEdit }/>
			// 	: null }</Page>
			<Page id={ this.props.name } direction="right">
				<Form
					data={ _.omit( this.state, [ "collection" ] ) }
					collection={ this.state.collection }
					actionType={ this.actionType }
					onReset={ this.handleFormReset } />
				{ this.state.collection
				? <List
					collection={ this.state.collection }
					onEdit={ this.handleListEdit }/>
				: null }</Page>
		);
	}// TODO: ,
}// TODO: );

// TODO: List.React = {
// 	Todos: _todos
// 	, TodosForm: _todosForm
// 	, TodosList: _todosList
// 	, TodosListItem: _todosListItem
// };

// List.Content = Content.extend( {
// 	ReactClass: List.React.Todos
// } );

// export default List;