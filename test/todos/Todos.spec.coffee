define ["apps/AppManager", "apps/todos/App", "apps/todos/show/Controller", "apps/common/View", "apps/todos/show/View", "apps/common/Dispatcher"], (AppManager, App, Controller, CommonView, View, Dispatcher) ->
	describe "Todos", ->
		before ->
			@options =
				id: "todos"
				title: "Todos List"
			$("<div id='fixture' style='display:none'>").appendTo("body");
		after ->
			$("#fixture").remove()
		describe "App", ->
			it "creates an app", ->
				AppManager.should.exist
				App.should.exist
		describe "Controller", ->
			before ->
				@changePage = sinon.stub AppManager, "changePage", -> Backbone.Events
			after ->
				@changePage.restore()
			it "creates a controller", ->
				Controller.should.exist
			it "list todos when started", ->
				Controller.show()

				@changePage.should.have.been.calledOnce
				@changePage.should.have.been.calledWithMatch @options
		describe "Common View", ->
			before ->
				$("#fixture").append("<div id='PanelRegion' /><div id='HeaderRegion' /><div id='MainRegion' /><div id='FooterRegion' />").appendTo("body");
				_options = _.extend @options, { main: Marionette.ItemView.extend { render: -> } }
				new CommonView.Layout _options
			after ->
				$("#fixture").empty()
			it "displays the header", ->
				$("#fixture #HeaderRegion h1.ui-title").should.have.text @options.title
			it "displays the content", ->
				$("#fixture #MainRegion #todos").should.exist
		describe "View", ->
			before ->
				name = "todos"
				@actionType =
					CREATE: name + ":create"
					UPDATE: name + ":update"
					DELETE: name + ":delete"

				$("#fixture").append("<div id='PanelRegion' /><div id='HeaderRegion' /><div id='MainRegion' /><div id='FooterRegion' />").appendTo("body");
				mainRegion = Marionette.Region.extend el: "#MainRegion"
				@view = new View.Todos _.extend @options, region: new mainRegion()

				@react = React.addons.TestUtils

				@request = sinon.stub AppManager, "request", $.proxy( ->
					defer = $.Deferred()
					setTimeout $.proxy( ->
						todos = new Backbone.Collection [ 
							{ id: 1, title: "Todo 1", completed: false }
							{ id: 2, title: "Todo 2", completed: true }
						]
						todos.actionType = @actionType
						defer.resolve todos
					, @)
					return fetch: defer.promise(), actionType: @actionType, dispatcher: new Dispatcher()
				, @)
				@submitForm = (form, inputValue, actionType) ->
					input = $(ReactDOM.findDOMNode form).find "input[type='text']"

					@react.Simulate.change input[0], target: value: inputValue

					submit = ReactDOM.findDOMNode form.refs.btnSubmit
					$(submit).click()

					@trigger.should.have.been.calledOnce
					@trigger.should.have.been.calledWithMatch actionType, title: inputValue
			beforeEach ->
				@trigger = sinon.stub @view, "trigger"
			after ->
				@request.restore()

				$("#fixture").empty()
			afterEach ->
				@trigger.restore()
			it "renders a page", ->
				@view.render()
				$.mobile.initializePage()

				@view.page.should.exist
				@view.el.should.exist
				@react.findRenderedComponentWithType(@view.page, View.React.Todos).should.exist
			describe "Form", ->
				it "renders a form", ->
					@form = @react.findRenderedComponentWithType @view.page, View.React.TodosForm
					@form.should.exist
				it "creates a todo when submitted", ->
					@submitForm @form, "Todo 1", @actionType.CREATE
			describe "List", ->
				it "renders a list", ->
					@list = @react.findRenderedComponentWithType @view.page, View.React.TodosList
					@list.should.exist
				it "fetches todos collection", (done) ->
					@request.should.have.been.calledOnce
					@request.should.have.been.calledWithMatch "entity", url: "todos"

					$el = @list.$el
					setTimeout ->
						$el.should.exist
						$el.children().should.have.length 2
						done()
					, 1
				it "can edit a todo", (done) ->
					setTimeout $.proxy( ->
						todo = @list.$el.children().first()
						todo.find("#btnEditTodo").click()
						
						@form = @react.findRenderedComponentWithType @view.page, View.React.TodosForm
						form = ReactDOM.findDOMNode @form
						input = $(form).find "input[type='text']"
						input.should.have.value "Todo 1"

						@submitForm @form, "Todo 3", @actionType.UPDATE

						done()
					, @)
					, 1
				it "can delete a todo", (done) ->
					setTimeout $.proxy( ->
						todo = @list.$el.children().first()
						todo.find("#btnDeleteTodo").click()

						@trigger.should.have.been.calledOnce
						@trigger.should.have.been.calledWithMatch @actionType.DELETE

						done()
					, @)
					, 1