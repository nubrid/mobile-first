// NOTE: import { createLogger } from "redux-logger";
import reducers from "./reducers"

export const createStore = () =>
  Redux.createStore(
    reducers,
    // TODO: persistedState,
    // NOTE: Redux.applyMiddleware(createLogger()),
  )
