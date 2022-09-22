import Apps from "apps";
import { AppContainer } from "react-hot-loader";
import { store } from "common/entities";

const { Provider } = ReactRedux;

const render = Component => {
  ReactDOM.render(
    <AppContainer>
      <Provider store={store}>
        <Component />
      </Provider>
    </AppContainer>,
    document.getElementById("main"),
  );
};

render(Apps);

if (module.hot)
  module.hot.accept("apps", () => {
    render(Apps);
  });
