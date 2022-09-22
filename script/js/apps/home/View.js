import popupTools from "popup-tools"

import A from "common/ui/A"
import Button from "common/ui/Button"
import Input from "common/ui/Input"

const HomeView = () => {
  let url = "" // HACK:
  const handleOnChange = ({ target }) => (url = target.value)

  const handleOpenBrowserClick = () => {
    const referrer = window.open(url, "_blank", "location=no")

    setTimeout(function() {
      referrer.close()
    }, 5000)
  }

  const handleLoginClick = event => {
    const provider = event.target.hash.substring(1)

    popupTools.popup(
      `${AppManager.url}/auth/${provider}`,
      `${provider} connect`,
      {},
      (error, user) => console.log(user), // eslint-disable-line no-console
    )

    event.preventDefault()
    return false
  }

  return (
    <>
      <Input placeholder="http://www.nubrid.com" onChange={handleOnChange} />
      <Button onClick={handleOpenBrowserClick}>Open Browser</Button>
      <div>
        <A href="#todos">Todos</A>
      </div>
      <div onClick={handleLoginClick} className="social-media">
        <A href="#facebook" title="facebook" className="facebook">
          Facebook
        </A>
        <A href="#twitter" title="twitter" className="twitter">
          Twitter
        </A>
        <A href="#linkedin" title="linkedin" className="linkedin">
          LinkedIn
        </A>
      </div>
    </>
  )
}

export default HomeView
