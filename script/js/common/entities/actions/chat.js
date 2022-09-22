import uuid from "uuid"

import { createAction } from "common/entities/actions"
import { ADD_ITEM, EDIT_ITEM, DELETE_ITEM } from "../constants/actionTypes/chat"

export const addItem = createAction(ADD_ITEM, item => ({
  ...item,
  id: uuid(),
  completed: false,
}))
export const editItem = createAction(EDIT_ITEM)
export const deleteItem = createAction(DELETE_ITEM)
