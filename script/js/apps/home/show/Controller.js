/*
Home Show Controller
*/
import AppManager from "apps/AppManager";
import CommonController from "apps/common/Controller";
import { IFrame } from "apps/common/View";
import { Content } from "apps/home/show/View";
import "entities/Common";
export default CommonController.extend({
	title: "Home"
	, Main: Content
	, show () {
		let page = AppManager.changePage(_.pick(this, "id", "title", "Main", "Layout")); //, reverse: true });

		page.on("home:openBrowser", function (value) {
			AppManager.net(() => AppManager.popup({ popup: IFrame, src: value, width: 400, height: 300 }));
		});

		page.on("home:login", function (event) {
			let provider = $(event.target).attr("href").substring(1);

			AppManager.net(() => {
				let loginWindow = window.open(`${window.url}/auth/${provider}`, "_blank", "location=no");

				loginWindow.addEventListener("loadstop", event => {
					if (event.url.indexOf(window.url) === 0) {
						if (event.url.indexOf(`${window.url}/#failed`) === 0) {
							alert("Login failed!");
						}
						else if (event.url.indexOf(`${window.url}/`) === 0) {
							alert("Login succeeded! See console for profile.");
						}

						loginWindow.close();
					}
				});
			});

			event.preventDefault();
			return false;
		});

		AppManager.navigate("home", { replace: true });
	}
});