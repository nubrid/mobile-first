/*
Todos Show View
*/
define(
["apps/AppManager"
, "apps/common/View"
, "entities/Common"]
, function (AppManager, CommonView, CommonEntity) {
	"use strict";
	var List = {};

	var _todos = React.createClass({
		displayName: "Todos"
		, getInitialState: function () {
			return { collection: null };
		}
		, handleFormReset: function (state) {
			this.setState(state);
		}
		, handleListEdit: function (state) {
			this.setState(state);
		}
		, componentDidMount: function () {
			var entity = AppManager.request("entity", { url: this.props.id, query: "{todos{id, title, completed}}", dispatcher: this.props.view.options.dispatcher });
			// this.props.view.dispatcher = entity.dispatcher; // Need to set this so that the Controller can properly dispatch.
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
					data: _.omit(this.state, "collection")
					, actionType: this.actionType
					, view: this.props.view
					, onReset: this.handleFormReset
				})
				, this.state.collection
					? React.createElement(List.React.TodosList, {
						collection: this.state.collection
						, view: this.props.view
						, onEdit: this.handleListEdit
					}) : null
			);
		}
	});

	var _todosForm = React.createClass({
		displayName: "TodosForm"
		, getInitialState: function () {
			return {
				id: -1
				, title: ""
				, completed: false
			};
		}
		, handleCancelClick: function () {
			this.reset = true;
			this.props.onReset(this.getInitialState());
		}
		, handleChange: function (event) {
			this.setState({ title: event.target.value });
		}
		, handleSubmitClick: function () {
			this.props.view.trigger(this.state.id > 0 ? this.props.actionType.UPDATE : this.props.actionType.CREATE, this.state);

			this.reset = true;
			this.props.onReset(this.getInitialState());
		}
		, componentDidUpdate: function () {
			if (this.reset || (typeof this.props.data.id !== "undefined" && !_.isEqual(this.props.data, this.data))) {
				this.data = this.props.data;
				this.setState(this.props.data);
				this.reset = false;
			}
		}
		, render: function () {
			return React.createElement("div", null
				, React.createElement("label", null, this.state.id ? "Edit Todo" : "Create a new Todo")
				, React.createElement("input", { type: "hidden", value: this.state.id })
				, CommonView.UI.input({ value: this.state.title, onChange: this.handleChange })
				, CommonView.UI.button({ onClick: this.handleSubmitClick }, this.state.id > 0 ? "Update" : "Add")
				, this.state.id > 0 ? CommonView.UI.button({ onClick: this.handleCancelClick }, "Cancel") : null
			);
		}
	});

	var _todosList = React.createClass({
		displayName: "TodosList"
		, mixins: [AppManager.BackboneMixin, CommonEntity.PureRenderMixin]
		, handleChange: function (event) {
			var el = $(event.target);

			var attrs = _.defaults({ completed: el[0].checked }, _.findWhere(this.state.collection, { id: parseInt(el.attr("data-id"), 10) }));
			this.props.view.trigger(this.props.collection.actionType.UPDATE, attrs);
		}
		, handleClick: function (event) {
			var el = $(event.target);
			var id = parseInt(el.attr("data-id"), 10);

			switch (el.attr("id")) {
				case "btnEditTodo":
					this.props.onEdit(_.findWhere(this.state.collection, { id: id }));
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
				, this.state.collection.map(this.createItem));
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