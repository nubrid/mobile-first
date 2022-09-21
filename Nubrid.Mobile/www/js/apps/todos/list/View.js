/*
Todos List View
*/
define(
["apps/AppManager"
, "entities/Todo"]
, function (AppManager) {
	var _actionType = AppManager.TodosApp.Constants.ActionType;
	var List = AppManager.module("TodosApp.List");
	List.Todos = Marionette.ItemView.extend({
		initialize: function (options) {
			this.parentEl = options.region ? options.region.$el[0] : this.el;
		}
		, render: function () {
			this.page = React.render(React.createElement(List.React.Todos, { id: this.id, view: this }), this.parentEl);
			this.el = React.findDOMNode(this.page); // HACK: Avoid conflict with Marionette region show and react render.

			return this;
		}
	});

	var _todos = React.createClass({
		displayName: "Todos"
		, mixins: [React.addons.LinkedStateMixin]
		, getInitialState: function () {
			return {
				id: null
				, title: ""
				, completed: false
			};
		}
		, handleSubmitClick: function (event) {
			var el = $(event.target);

			var initialState = this.getInitialState();
			var attrs = _.pick(_.omit(this.state, "collection"), _.keys(initialState));

			this.props.view.trigger(attrs.id ? _actionType.UPDATE : _actionType.CREATE, attrs);

			this.setState(initialState);
		}
		, handleCancelClick: function (event) {
			var initialState = this.getInitialState();
			this.setState(initialState);
		}
		, handleEditClick: function (attrs) {
			this.setState(attrs);
		}
		, componentDidMount: function () {
			var self = this;
			var fetchingTodos = AppManager.request("todo:entities");
			$.when(fetchingTodos).done(function (todos) {
				self.setState({ collection: todos });
			});
		}
		, componentWillUnmount: function () {
			this.state.collection.close();
		}
		, render: function () {
			return React.createElement(React.addons.CSSTransitionGroup, { "data-role": "page", id: this.props.id, component: "div", transitionName: "page", transitionAppear: true, className: "bounceInRight" }
				, React.createElement("div", { role: "main", className: "ui-content" }
					, React.createElement(List.React.TodosForm, {
						id: this.state.id
						, linkState: this.linkState
						, handleSubmitClick: this.handleSubmitClick
						, handleCancelClick: this.handleCancelClick
					})
					, React.createElement(List.React.TodosList, {
						collection: this.state.collection
						, view: this.props.view
						, handleEditClick: this.handleEditClick
					})
				)
			);
		}
	});

	var _todosForm = React.createClass({
		displayName: "TodosForm"
		, componentDidMount: function () {
			$(React.findDOMNode(this.refs.btnSubmit)).on("click", this.props.handleSubmitClick);
		}
		, componentDidUpdate: function (prevProps, prevState) {
			$(React.findDOMNode(this.refs.btnSubmit)).button("refresh");
			if (this.refs.btnCancel)
				$(React.findDOMNode(this.refs.btnCancel))
					.button().button("refresh")
					.on("click", this.props.handleCancelClick);
		}
		, render: function () {
			return React.createElement("div", null
				, React.createElement("label", null, this.props.id ? "Edit Todo" : "Create a new Todo")
				, React.createElement("input", { type: "hidden", value: this.props.id })
				, React.createElement("input", { type: "text", valueLink: this.props.linkState("title") })
				, React.createElement("input", { type: "button", ref: "btnSubmit", value: this.props.id ? "Update" : "Add" })
				, this.props.id ? React.createElement("input", { type: "button", ref: "btnCancel", value: "Cancel" }) : null
			);
		}
	});

	var _todosList = React.createClass({
		displayName: "TodosList"
		, mixins: [AppManager.BackboneMixin]
		, handleChange: function (event) {
			var el = $(event.target);

			var attrs = _.extend(_.findWhere(this.state.collection, { id: el.attr("data-id") }), { completed: el[0].checked });
			this.props.view.trigger(_actionType.UPDATE, attrs);
		}
		, handleClick: function (event) {
			var el = $(event.target);
			var id = el.attr("data-id");

			switch (el.attr("id")) {
				case "btnEditTodo":
					this.props.handleEditClick(_.findWhere(this.state.collection, { id: id }));
					break;
				case "btnDeleteTodo":
					this.props.view.trigger(_actionType.DELETE, _.findWhere(this.state.collection, { id: id }));
					break;
			}
		}
		, componentDidMount: function () {
			this.$el.on("change", this.handleChange);
			this.$el.on("click", this.handleClick);

			this.$el.enhanceWithin();
		}
		, componentDidUpdate: function (prevProps, prevState) {
			if ((this.wrapper.nextState && this.wrapper.nextState.collection.length > prevState.collection.length) || !prevState.collection) {
				this.$el.enhanceWithin()
			}
			else if (!prevState.isRequesting && this.wrapper.nextState) {
				var nextCollection = this.wrapper.nextState.collection;
				var checkbox = null;
				var self = this;

				_.each(_.filter(nextCollection, function (model) {
					return !_.isEqual(model.completed, _.findWhere(prevState.collection, { id: model.id }).completed);
					// TODO: If you need to compare all attributes.
					//return !_.isEqual(model, _.findWhere(prevState.collection, { id: model.id }));
				}), function (model) {
					checkbox = $(React.findDOMNode(self.refs["chk_" + model.id]));
					checkbox[0].checked = model.completed;
					checkbox.checkboxradio("refresh");
				})
			}
		}
		, createItem: function (item, id) {
			return React.createElement("div", { key: item.id, "data-role": "controlgroup", "data-type": "horizontal" }
				, React.createElement("h3", null, item.title)
				, React.createElement("label", null, React.createElement("input", { type: "checkbox", ref: "chk_" + item.id, defaultChecked: item.completed, "data-id": item.id }), "Complete")
				, React.createElement("input", { type: "button", id: "btnEditTodo", value: "Edit", "data-id": item.id })
				, React.createElement("input", { type: "button", id: "btnDeleteTodo", value: "Delete", "data-id": item.id })
			);
		}
		, render: function () {
			return React.createElement(React.addons.CSSTransitionGroup, { transitionName: "list-item" }
				, this.state.collection ? this.state.collection.map(this.createItem) : null);
		}
	});

	List.React = {
		Todos: _todos
		, TodosForm: _todosForm
		, TodosList: _todosList
	};

	return List;
});