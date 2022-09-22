describe "AppManager", ->
	it "should return AppManager", ->
		AppManager.should.exist

		if __DEV__
			expect( window.AppManager ).to.exist
	describe "Transition", ->
		it "should exist", ->
			AppManager.Transition.ListItem.should.exist
	describe "changePage", ->
		before ->
			@mobile = $.mobile
			$.mobile = initializePage: sinon.stub()
			@navigate = sinon.stub AppManager, "navigate", ->
		after ->
			$.mobile = @mobile
			@navigate.restore()
		it "should change page", ->
			expect( AppManager.currentLayout ).to.not.exist

			@layout = sinon.spy class Layout
				initialize: sinon.spy -> @
				MainRegion:
					currentView: "test_currentView"

			view = AppManager.changePage
				Layout: @layout
				id: "test_id"
			@layout.should.have.been.calledWithNew
			AppManager.currentLayout.should.exist
			$.mobile.initializePage.should.have.been.calledOnce
			@navigate.should.have.been.calledWithMatch "test_id"
			view.should.equal "test_currentView"

			AppManager.changePage
				Layout: @layout
				id: "test_id2"
			AppManager.currentLayout.initialize.should.have.been.calledOnce
			AppManager.currentLayout.initialize.should.have.been.calledWith Layout: @layout, id: "test_id2"
	describe "currentRoute", ->
		before ->
			@currentRoute = sinon.spy AppManager, "currentRoute"
		after ->
			@currentRoute.restore()
		it "should return current route", ->
			AppManager.currentRoute()
			@currentRoute.should.have.returned Backbone.history.fragment
	describe "navigate", ->
		before ->
			@navigate = sinon.stub Backbone.history, "navigate"
		after ->
			@navigate.restore()
		it "should navigate to the specified route", ->
			AppManager.navigate "test_arg1", "test_arg2"
			@navigate.should.have.been.calledOnce
			@navigate.should.have.been.calledWith "test_arg1", "test_arg2"
	describe "net", ->
		before ->
			@request = sinon.stub AppManager, "request"
			@callback = sinon.spy()
		after ->
			@request.restore()
		it "should check the net before running the callback", ->
			AppManager.net @callback
			@request.should.have.been.calledOnce
			@request.should.have.been.calledWith "connect", { @callback, closeOnOpen: true }

			connection = navigator.connection
			navigator.connection =
				type: "test_wifi"
			Connection = window.Connection
			window.Connection =
				WIFI: "test_wifi"

			@request.reset()
			AppManager.net @callback
			@request.should.not.have.been.called
			@callback.should.have.been.calledOnce

			navigator.connection = connection
			window.Connection = Connection
	describe "start", ->
		before ->
			@history_start = sinon.stub Backbone.history, "start"
		after ->
			@history_start.restore()
		it "should start AppManager", ->
			start = sinon.stub AppManager, "onStart"
			AppManager.start()
			start.should.have.been.calledOnce
			start.restore()

			$on = sinon.stub $.fn, "on"
			AppRouter = sinon.stub Marionette, "AppRouter"
			AppManager.start()
			$on.should.have.been.calledOnce
			$on.should.have.been.calledWithMatch "click"
			$on.restore()
			AppRouter.should.have.been.calledOnce
			AppRouter.should.have.been.calledWithNew
			AppRouter.should.have.been.calledWithMatch appRoutes: sinon.match.object, controller: initRoute: sinon.match.func
			AppRouter.restore()
			@history_start.should.have.been.calledOnce

			@history = Backbone.history
			Backbone.history = undefined
			AppManager.start()
			Backbone.history = @history