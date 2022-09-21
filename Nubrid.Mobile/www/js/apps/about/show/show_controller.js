define(
["apps/contact_manager"
, "apps/about/show/show_view"]
, function (ContactManager) {
	var Show = ContactManager.module("AboutApp.Show");
	Show.Controller = {
		showAbout: function () {
			var view = new Show.Message();
			ContactManager.mainRegion.show(view);
		}
	};
});