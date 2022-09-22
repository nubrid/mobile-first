import A from "common/ui/A";
import Button from "common/ui/Button";
import Input from "common/ui/Input";
import popupTools from "popup-tools";

const HomeView = () => {
  const txtInput = React.createRef();

  const handleOpenBrowserClick = () => {
    const referrer = window.open(
      txtInput.current.value,
      "_blank",
      "location=no",
    );

    setTimeout(function() {
      referrer.close();
    }, 5000);
  };

  const handleLoginClick = event => {
    const provider = event.target.hash.substring(1);

    popupTools.popup(
      `${AppManager.url}/auth/${provider}`,
      `${provider} connect`,
      {},
      (error, user) => console.log(user), // eslint-disable-line no-console
    );

    event.preventDefault();
    return false;
  };

  return (
    <>
      <Input ref={txtInput} />
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
  );
};

export default HomeView;
