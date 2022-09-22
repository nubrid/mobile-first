import chat from "./chat"
import todos from "./todos"

const { combineReducers } = Redux

export default combineReducers({ chat, todos })
