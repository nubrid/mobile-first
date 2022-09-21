define ["apps/AppManager", "apps/todos/App", "apps/todos/list/Controller", "apps/common/View"], (AppManager, App, Controller, CommonView) ->
	describe "Todos", ->
		beforeEach ->
			@options =
				id: "todos"
				title: "Todos List"
		describe "App", ->
			it "creates an app", ->
				AppManager.should.exist
				App.should.exist
		describe "Controller", ->
			beforeEach ->
				@changePage = sinon.stub AppManager, "changePage", -> Backbone.Events
			afterEach ->
				@changePage.restore()
			it "creates a controller", ->
				Controller.should.exist
			it "list todos when started", ->
				Controller.start()
				AppManager.trigger "todos:list"

				@changePage.should.have.been.calledOnce
				@changePage.should.have.been.calledWithMatch @options
		describe "Common View", ->
			beforeEach ->
				$("<div id='fixture' style='display:none'>").appendTo("body");
				$("#fixture").append("<div id='PanelRegion' /><div id='HeaderRegion' /><div id='MainRegion' /><div id='FooterRegion' />").appendTo("body");
				_options = _.extend @options, { main: Marionette.ItemView.extend { render: -> } }
				_layout = new CommonView.Layout _options
			afterEach ->
				$("#fixture").remove()
			it "displays the header", ->
				$("#fixture #HeaderRegion h1.ui-title").should.have.text @options.title
			it "displays the content", ->
				$("#fixture #MainRegion #todos").should.exist