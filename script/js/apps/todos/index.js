import CommonApp from "common/App";
import View from "./View";

const TodosApp = () => {
  const children = (/*CommonApp this.state*/) => <View />;
  return <CommonApp name="home">{children}</CommonApp>;
};

export default TodosApp;
