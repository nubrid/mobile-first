import CommonApp from "common/App"
import View from "./View"

const ChatApp = () => {
  const children = (/*CommonApp this.state*/) => <View />
  return <CommonApp name="chat">{children}</CommonApp>
}

export default ChatApp
