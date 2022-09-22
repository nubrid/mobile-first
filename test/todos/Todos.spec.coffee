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
				(new Controller(@options)).show()

				@changePage.should.have.been.calledOnce
				@changePage.should.have.been.calledWithMatch @options
		describe "Common View", ->
			before ->
				$("#fixture").append("<div id='PanelRegion' /><div id='HeaderRegion' /><div id='MainRegion' /><div id='FooterRegion' />").appendTo("body");
				Marionette.Region.prototype.attachHtml = ->
				@render = ->
				@renderSpy = sinon.spy @, "render"
				_.extend @options, { Main: Marionette.ItemView.extend { render: @render } }
				layout = new CommonView.Layout @options
			after ->
				$("#fixture").empty()
			it "displays the header", ->
				$("#fixture #HeaderRegion h1.ui-title").should.have.text @options.title
			it "displays the content", ->
				@renderSpy.should.have.been.calledOnce
		describe "View", ->
			before ->
				name = "todos"
				@actionType =
					CREATE: name + ":create"
					UPDATE: name + ":update"
					DELETE: name + ":delete"

				$("#fixture").append("<div id='PanelRegion' /><div id='HeaderRegion' /><div id='MainRegion' /><div id='FooterRegion' />").appendTo("body");
				MainRegion = Marionette.Region.extend el: "#MainRegion"
				@view = new View.Content _.extend @options, region: new MainRegion()

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
					return fetch: defer.promise(), actionType: @actionType
				, @)
				@submitForm = (form, inputValue, actionType) ->
					form = $(ReactDOM.findDOMNode form)
					input = form.find ".ui-input-text input"

					@react.Simulate.change input[0], target: value: inputValue

					submit = form.find "button.ui-btn"
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
			it "renders a page", (done) ->
				@view.render()
				$.mobile.initializePage()

				@view.page.should.exist
				@view.el.should.exist
				@react.findRenderedComponentWithType(@view.page, View.React.Todos).should.exist
				setTimeout -> 
					done()
				, 1
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
						input = $(form).find ".ui-input-text input"
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