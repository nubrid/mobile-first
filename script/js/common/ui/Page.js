// TODO: import Transition from "./Transition";

const Page = ({ id, children }) => (
  <div id={id} data-role="page">
    <div role="main" className="ui-content">
      {children}
    </div>
  </div> // TODO: <Transition { ...props } data-role="page" component="div"><div role="main" className="ui-content">{ props.children }</div></Transition>
)
Page.propTypes = {
  id: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
}

export default Page
