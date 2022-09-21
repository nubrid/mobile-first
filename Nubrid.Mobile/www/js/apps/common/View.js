/*
Common View
*/
define(
["apps/AppManager"
, "text!apps/common/Header.html"]
, function (AppManager, HeaderTemplate) {
	var View = AppManager.module("Common.View");
	View.Layout = Marionette.LayoutView.extend({
		el: "body"
		, regions: {
			PanelRegion: "#PanelRegion"
			, HeaderRegion: "#HeaderRegion"
			, MainRegion: "#MainRegion"
			, FooterRegion: "#FooterRegion"
		}
		, initialize: function (options) {
		    var Header = options.header ? options.header : View.Header;
		    if (!(this.HeaderRegion.currentView instanceof Header)) {
		        this.HeaderRegion.show(new Header());
		        this.HeaderRegion.$el.parent().toolbar();
            }
			if (options.footer) {
			    var Footer = options.footer;
			    if (!(this.FooterRegion.currentView instanceof Footer)) {
			        this.FooterRegion.show(new Footer());
			        this.FooterRegion.$el.parent().toolbar();
                }
			}

			var Main = options.main;
			if (!(this.MainRegion.currentView instanceof Main)) this.MainRegion.show(new Main());

			this.PanelRegion.$el.panel();
			$.mobile.resetActivePageHeight();

			return this;
		}
	});

	View.Header = Marionette.ItemView.extend({
		template: _.template(HeaderTemplate)
	});

	return View;
});