import { ADD_ITEM, EDIT_ITEM, DELETE_ITEM } from "../constants/actionTypes/chat"

const reducer = (state = [], { type, payload }) => {
  switch (type) {
    case ADD_ITEM:
      return [...state, payload]
    case EDIT_ITEM:
      // eslint-disable-next-line lodash/prefer-lodash-method
      return state.map(item =>
        item.id === payload.id ? { ...item, ...payload } : item,
      )
    case DELETE_ITEM:
      return state.filter(({ id }) => id !== payload.id)
    default:
      return state
  }
}

export default reducer
