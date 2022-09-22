import _ from "lodash";
import ListItem from "./ListItem";

// TODO: const _todosList = React.createClass( {
export default class TodosList extends React.Component {
	// TODO: displayName: "TodosList",
	// mixins: [ BackboneReactMixin, BackboneImmutable.PureRenderMixin ],
	static propTypes = {
		collection: React.PropTypes.object.isRequired,
		onEdit: React.PropTypes.func.isRequired,
	}

	componentWillMount() {
		BackboneReactMixin.on( this, {
			collections: {
				collection: this.props.collection
			}
		} );
	}

	componentWillUnmount() {
		BackboneReactMixin.off( this );
	}

	handleItemClick = ( event ) => {
		event.preventDefault();
		const el = event.target
			, id = el.getAttribute( "data-id" ); // TODO: $( event.target );
		let attrs = {};

		switch ( el.innerText ) { // TODO: .text() ) {
			case "Edit": {
				// TODO: el.data( "id" );
				attrs = { ...this.props.collection.get( id ).attributes }; // TODO: _.clone( this.props.collection.get( id ).attributes );
				this.props.onEdit( _.defaults( attrs, { id } ) );
				break;
			}
			case "Delete":
				this.props.collection.dispatcher.trigger( this.props.collection.actionType.DELETE, { id }); // TODO: .data( "id" ) } ); // TODO: this.props.view.trigger( this.props.collection.actionType.DELETE, { id: el.data( "id" ) } );
				break;
			default: { // TODO: case "Complete": {
				// TODO: const chkComplete = el.next( "input" );
				attrs = { completed: el.checked }; // TODO: !chkComplete.prop( "checked" ) };
				this.props.collection.dispatcher.trigger( this.props.collection.actionType.UPDATE, { id, attrs } ); // TODO: this.props.view.trigger( this.props.collection.actionType.UPDATE, { id: chkComplete.data( "id" ), attrs } );
				// TODO: break;
			}
		}
	}// TODO: ,

	createItem = ( item ) => {
		return (
			// TODO: <List.React.TodosListItem key={ item.id } item={ item } onClick={ this.handleItemClick } />
			<ListItem key={ item.id } item={ item } onClick={ this.handleItemClick } />
		);
	}// TODO: ,

	render() {
		return <ReactCSSTransitionGroup transitionName="list-item" transitionEnterTimeout={ 500 } transitionLeaveTimeout={ 500 }>{ Array.from( this.props.collection.models, this.createItem ) }</ReactCSSTransitionGroup>; // TODO: <ReactCSSTransitionGroup { ...AppManager.transition.listItem }>{ this.props.collection.models.map( this.createItem ) }</ReactCSSTransitionGroup>;
	}// TODO: ,
}// TODO: );