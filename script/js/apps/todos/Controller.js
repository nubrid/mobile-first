import Controller from "apps/common/Controller";
import Main from "./View";

export default (id, callback) => {
  callback(
    new Controller({
      id,
      title: "Todos List",
      Main,
    }),
  );
};
