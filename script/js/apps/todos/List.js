import _ from "lodash";
import ListItem from "./ListItem";

export default class TodosList extends React.Component {
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
		});
	}

	componentWillUnmount() {
		BackboneReactMixin.off( this );
	}

	handleItemClick = ( event ) => {
		event.preventDefault();
		const el = event.target
			, id = el.getAttribute( "data-id" );

		switch ( el.innerText ) {
			case "Edit":
				this.props.onEdit( _.defaults( { ...this.props.collection.get( id ).attributes }, { id } ) );

				break;
			case "Delete":
				this.props.collection.dispatcher.trigger( this.props.collection.actionType.DELETE, { id });

				break;
			default:
				this.props.collection.dispatcher.trigger( this.props.collection.actionType.UPDATE, { id, attrs: { completed: el.checked } });
		}
	}

	createItem = ( item ) => {
		return (
			<ListItem key={ item.id } item={ item } onClick={ this.handleItemClick } />
		);
	}

	render() {
		return <ReactCSSTransitionGroup transitionName="list-item" transitionEnterTimeout={ 500 } transitionLeaveTimeout={ 500 }>{Array.from( this.props.collection.models, this.createItem )}</ReactCSSTransitionGroup>;
	}
}