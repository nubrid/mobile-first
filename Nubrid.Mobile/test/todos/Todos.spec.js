
define(["apps/AppManager", "apps/todos/App", "apps/todos/list/Controller", "apps/common/View"], function(AppManager, App, Controller, CommonView) {
  return describe("Todos", function() {
    beforeEach(function() {
      return this.options = {
        id: "todos",
        title: "Todos List"
      };
    });
    describe("App", function() {
      return it("creates an app", function() {
        AppManager.should.exist;
        return App.should.exist;
      });
    });
    describe("Controller", function() {
      beforeEach(function() {
        return this.changePage = sinon.stub(AppManager, "changePage", function() {
          return Backbone.Events;
        });
      });
      afterEach(function() {
        return this.changePage.restore();
      });
      it("creates a controller", function() {
        return Controller.should.exist;
      });
      return it("list todos when started", function() {
        Controller.start();
        AppManager.trigger("todos:list");
        this.changePage.should.have.been.calledOnce;
        return this.changePage.should.have.been.calledWithMatch(this.options);
      });
    });
    return describe("Common View", function() {
      beforeEach(function() {
        var _layout, _options;
        $("<div id='fixture' style='display:none'>").appendTo("body");
        $("#fixture").append("<div id='PanelRegion' /><div id='HeaderRegion' /><div id='MainRegion' /><div id='FooterRegion' />").appendTo("body");
        _options = _.extend(this.options, {
          main: Marionette.ItemView.extend({
            render: function() {}
          })
        });
        return _layout = new CommonView.Layout(_options);
      });
      afterEach(function() {
        return $("#fixture").remove();
      });
      it("displays the header", function() {
        return $("#fixture #HeaderRegion h1.ui-title").should.have.text(this.options.title);
      });
      return it("displays the content", function() {
        return $("#fixture #MainRegion #todos").should.exist;
      });
    });
  });
});
