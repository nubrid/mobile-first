import Button from "apps/common/ui/Button";
import Checkbox from "apps/common/ui/Checkbox";

// TODO: const _todosListItem = React.createClass( {
const TodosListItem = ( props ) => ( // TODO: export default class TodosListItem extends React.Component {
	// TODO: displayName: "TodosListItem",
	// mixins: [ BackboneImmutable.PureRenderMixin ],

	// TODO: render() {
		// TODO: const item = this.props.item;
		// TODO: return (
	<div>
		<Checkbox id={ `chk_${props.item.id}` } data-id={ props.item.id } checked={ props.item.get( "completed" ) } onChange={ props.onClick }>{ props.item.get( "title" ) }</Checkbox>
		<Button data-id={ props.item.id } onClick={ props.onClick }>Edit</Button>
		<Button data-id={ props.item.id } onClick={ props.onClick }>Delete</Button></div>
		// TODO: );
	// TODO: },
// TODO: } );
);
TodosListItem.propTypes = {
	item: React.PropTypes.object,
	onClick: React.PropTypes.func,
};

export default TodosListItem;