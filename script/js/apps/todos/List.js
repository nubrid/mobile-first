import ListItem from "./ListItem";
import { editTodo, deleteTodo } from "common/entities/actions";

const ConnectedList = ({ items, editItem, deleteItem }) => {
  const handleItemClick = event => {
    const el = event.target,
      id = el.getAttribute("data-id");

    switch (el.innerText) {
      case "Delete":
        deleteItem({ id });
        break;
      default: {
        editItem({ id, completed: el.checked });
      }
    }
  };

  const createListItem = item => (
    <ListItem key={item.id} item={item} onClick={handleItemClick} />
  );

  return <div>{Array.from(items, createListItem)}</div>; // TODO: return <ReactCSSTransitionGroup transitionName="list-item" transitionEnterTimeout={ 500 } transitionLeaveTimeout={ 500 }>{ Array.from( todos, createListItem ) }</ReactCSSTransitionGroup>;
};
ConnectedList.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  editItem: PropTypes.func.isRequired,
  deleteItem: PropTypes.func.isRequired,
};

const mapStateToProps = ({ todos: items }) => ({ items });
const mapDispatchToProps = dispatch => ({
  editItem: item => dispatch(editTodo(item)),
  deleteItem: item => dispatch(deleteTodo(item)),
});

const { connect } = ReactRedux,
  TodosList = connect(
    mapStateToProps,
    mapDispatchToProps,
  )(ConnectedList);

export default TodosList;
