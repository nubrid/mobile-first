export const createAction = (type, payloadCreator) => {
  return function(item) {
    return {
      type,
      payload: payloadCreator ? payloadCreator(item) : item,
    }
  }
}
