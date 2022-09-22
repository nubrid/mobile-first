import { AppContainer } from "react-hot-loader"
import CssBaseline from "@material-ui/core/CssBaseline"
import { registerServiceWorkers } from "workbox"

import Apps from "apps"
import { createStore } from "common/entities"

const { Provider } = ReactRedux

const render = Component => {
  ReactDOM.render(
    <>
      <CssBaseline />
      <AppContainer>
        <Provider store={createStore()}>
          <Component />
        </Provider>
      </AppContainer>
    </>,
    document.getElementById("main"),
  )
}

render(Apps)
registerServiceWorkers()

if (module.hot)
  module.hot.accept("apps", () => {
    render(Apps)
  })
