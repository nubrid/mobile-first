import * as actions from "common/entities/actions/todos"

import ListItem from "./ListItem"

const ConnectedList = ({ items, editItem, deleteItem }) => {
  const handleItemClick = (action, id) => event => {
    switch (action) {
      case "delete":
        deleteItem({ id })
        break
      case "edit": {
        const el = event.target

        editItem({ id, completed: el.checked })
      }
    }
  }

  const createListItem = item => (
    <ListItem key={item.id} item={item} onClick={handleItemClick} />
  )

  return <div>{Array.from(items, createListItem)}</div> // TODO: return <ReactCSSTransitionGroup transitionName="list-item" transitionEnterTimeout={ 500 } transitionLeaveTimeout={ 500 }>{ Array.from( todos, createListItem ) }</ReactCSSTransitionGroup>;
}
ConnectedList.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  editItem: PropTypes.func.isRequired,
  deleteItem: PropTypes.func.isRequired,
}

const mapStateToProps = ({ todos: items }) => ({ items })

const { connect } = ReactRedux,
  TodosList = connect(
    mapStateToProps,
    actions,
  )(ConnectedList)

export default TodosList
