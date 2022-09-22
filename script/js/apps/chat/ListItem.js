import Button from "common/ui/Button"
import Checkbox from "common/ui/Checkbox"

const ChatListItem = ({ item: { id, title, completed }, onClick }) => (
  <div style={completed ? { textDecoration: "line-through" } : null}>
    <Checkbox
      id={`chk_${id}`}
      checked={completed}
      onChange={onClick("edit", id)}
    >
      {title}
    </Checkbox>
    <Button onClick={onClick("delete", id)}>Delete</Button>
  </div>
)
ChatListItem.propTypes = {
  item: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
}

export default ChatListItem
