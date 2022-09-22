import Button from "common/ui/Button";
import Checkbox from "common/ui/Checkbox";

const TodosListItem = ({ item: { id, title, completed }, onClick }) => (
  <div style={completed ? { textDecoration: "line-through" } : null}>
    <Checkbox
      id={`chk_${id}`}
      data-id={id}
      checked={completed}
      onChange={onClick}
    >
      {title}
    </Checkbox>
    <Button data-id={id} onClick={onClick}>
      Delete
    </Button>
  </div>
);
TodosListItem.propTypes = {
  item: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default TodosListItem;
