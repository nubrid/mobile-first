/*
Todos Show View
*/
define(
["apps/AppManager"
, "apps/common/View"
, "entities/Common"]
, function (AppManager, CommonView) {
	"use strict";
	var List = {};

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
		, handleSubmitClick: function () {
			var initialState = this.getInitialState();
			var attrs = _.pick(_.omit(this.state, "collection"), _.keys(initialState));

			this.props.view.trigger(attrs.id ? this.actionType.UPDATE : this.actionType.CREATE, attrs);

			this.setState(initialState);
		}
		, handleCancelClick: function () {
			var initialState = this.getInitialState();
			this.setState(initialState);
		}
		, handleEditClick: function (attrs) {
			this.setState(attrs);
		}
		, componentDidMount: function () {
			var entity = AppManager.request("entity", { url: "todos", query: "{todos{id, title, completed}}" });
			this.props.view.dispatcher = entity.dispatcher; // Need to set this so that the Controller can properly dispatch.
			this.actionType = entity.actionType;

			$.when(entity.fetch).done($.proxy(function (todos) {
				this.setState({ collection: todos });
			}, this));
		}
		, componentWillUnmount: function () {
			this.state.collection.close();
		}
		, render: function () {
			return CommonView.UI.page({ id: this.props.id, direction: "right" }
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
			);
		}
	});

	var _todosForm = React.createClass({
		displayName: "TodosForm"
		, componentDidMount: function () {
			$(this.btnSubmit).on("click", this.props.handleSubmitClick);
		}
		, componentDidUpdate: function () {
			if (this.btnCancel) $(this.btnCancel).on("click", this.props.handleCancelClick);
		}
		, render: function () {
			return React.createElement("div", null
				, React.createElement("label", null, this.props.id ? "Edit Todo" : "Create a new Todo")
				, React.createElement("input", { type: "hidden", value: this.props.id })
				, CommonView.UI.input({ valueLink: this.props.linkState("title") })
				, CommonView.UI.button({ ref: CommonView.UI.ref("btnSubmit", this) }, this.props.id ? "Update" : "Add")
				, this.props.id ? CommonView.UI.button({ ref: CommonView.UI.ref("btnCancel", this) }, "Cancel") : null
			);
		}
	});

	var _todosList = React.createClass({
		displayName: "TodosList"
		, mixins: [AppManager.BackboneMixin]
		, handleChange: function (event) {
			var el = $(event.target);

			var attrs = _.extend(_.findWhere(this.state.collection, { id: parseInt(el.attr("data-id"), 10) }), { completed: el[0].checked });
			this.props.view.trigger(this.props.collection.actionType.UPDATE, attrs);
		}
		, handleClick: function (event) {
			var el = $(event.target);
			var id = parseInt(el.attr("data-id"), 10);

			switch (el.attr("id")) {
				case "btnEditTodo":
					this.props.handleEditClick(_.findWhere(this.state.collection, { id: id }));
					break;
				case "btnDeleteTodo":
					this.props.view.trigger(this.props.collection.actionType.DELETE, _.findWhere(this.state.collection, { id: id }));
					break;
			}
		}
		, componentDidMount: function () {
			this.$el.on("change", this.handleChange);
			this.$el.on("click", this.handleClick);
		}
		, componentDidUpdate: function (prevProps, prevState) {
			if (this.wrapper.nextState && prevState.collection && this.wrapper.nextState.collection.length === prevState.collection.length) {
				var checkbox = null;
				_.each(this.wrapper.collection.models, function (model) {
					if (typeof model.changed.completed === "undefined") return;
					checkbox = $(this["chk_" + model.id]);
					checkbox[0].checked = model.changed.completed;
					checkbox.checkboxradio("refresh");
				}, this);
			}
		}
		, createItem: function (item) {
			return CommonView.UI.group({ key: item.id, type: "horizontal", title: item.title },
				CommonView.UI.checkbox({ id: "chk_" + item.id, ref: CommonView.UI.ref("chk_" + item.id, this), defaultChecked: item.completed, "data-id": item.id }, "Complete" )
				, CommonView.UI.button({ id: "btnEditTodo", "data-id": item.id }, "Edit")
				, CommonView.UI.button({ id: "btnDeleteTodo", "data-id": item.id }, "Delete")
			);
		}
		, render: function () {
			return React.createElement(React.addons.CSSTransitionGroup, AppManager.Transition.ListItem
				, this.state.collection ? this.state.collection.map(this.createItem) : null);
		}
	});

	List.React = {
		Todos: _todos
		, TodosForm: _todosForm
		, TodosList: _todosList
	};

	List.Content = CommonView.Content.extend({
		ReactClass: List.React.Todos
	});

	return List;
});