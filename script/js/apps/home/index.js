import CommonApp from "common/App"
import View from "./View"

const HomeApp = () => {
  const children = (/*CommonApp this.state*/) => <View />
  return <CommonApp name="home">{children}</CommonApp>
}

export default HomeApp
