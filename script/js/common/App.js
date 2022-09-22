import Page from "common/ui/Page"

const CommonApp = ({ name, children }) => (
  <Page id={name}>{children(/*this.state*/)}</Page>
)
CommonApp.propTypes = {
  name: PropTypes.string.isRequired,
  children: PropTypes.func.isRequired,
}

export default CommonApp
