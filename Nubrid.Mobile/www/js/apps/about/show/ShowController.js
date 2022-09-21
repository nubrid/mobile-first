define(
["apps/ContactManager"
, "apps/about/show/ShowView"]
, function (ContactManager) {
	var Show = ContactManager.module("AboutApp.Show");
	Show.Controller = {
		showAbout: function () {
			var view = new Show.Message();
			ContactManager.mainRegion.show(view);
		}
	};
});