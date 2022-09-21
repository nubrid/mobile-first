/*
Todos List View
*/
define(
["apps/AppManager"]
, function (AppManager) {
	var List = AppManager.module("TodosApp.List");
	List.Todos = Marionette.ItemView.extend({
		initialize: function (options) {
			this.parentEl = options.region ? options.region.$el[0] : this.el;
		}
		, render: function () {
			var self = this;
			this.view = React.render(React.createElement(Todos, { id: this.id, view: this }), this.parentEl);
			this.listenTo(this.collection, "change sync", function (modelOrCollection) {
				if (!self.view.state.collection) self.view.setState({ collection: modelOrCollection })
				else self.view.setProps({ changedId: modelOrCollection.id });
			});
			this.el = this.view.el; // HACK: Avoid conflict with Marionette region show and react render.

			return this;
		}
	});

	var Todos = React.createClass({
		displayName: "Todos"
		, mixins: [AppManager.BackboneMixin, React.addons.LinkedStateMixin]
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

			this.props.view.trigger("todo:" + (attrs.id ? "edit" : "add"), attrs);

			this.setState(initialState);
		}
		, handleCancelClick: function (event) {
			var initialState = this.getInitialState();
			this.setState(initialState);
		}
		, handleCompletedChange: function (id, checked) {
			var attrs = _.extend(this.state.collection.get(id).toJSON(), { completed: checked });
			this.props.view.trigger("todo:edit", attrs);
		}
		, handleEditClick: function (id) {
			this.setState(this.state.collection.get(id).attributes);
		}
		, handleDeleteClick: function (id) {
			this.props.view.trigger("todo:delete", this.state.collection.get(id));
		}
		, render: function () {
			return React.createElement("div", { "data-role": "page", id: this.props.id }
				, React.createElement("div", { role: "main", className: "ui-content" }
					, React.createElement(TodosForm, {
						id: this.state.id
						, linkState: this.linkState
						, handleSubmitClick: this.handleSubmitClick
						, handleCancelClick: this.handleCancelClick
					})
					, this.state.collection ? React.createElement(TodosList, {
						collection: this.state.collection
						, changedId: this.props.changedId
						, handleCompletedChange: this.handleCompletedChange
						, handleEditClick: this.handleEditClick
						, handleDeleteClick: this.handleDeleteClick
					}) : null
				)
			);
		}
	});

	var TodosForm = React.createClass({
		displayName: "TodosForm"
		, componentDidMount: function () {
			$(this.refs.btnSubmit.getDOMNode()).on("click", null, this.props.handleSubmitClick);
		}
		, componentDidUpdate: function (prevProps, prevState) {
			$(this.refs.btnSubmit.getDOMNode()).button("refresh");
			if (this.refs.btnCancel)
				$(this.refs.btnCancel.getDOMNode())
					.button().button("refresh")
					.on("click", null, this.props.handleCancelClick);
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

	var TodosList = React.createClass({
		displayName: "TodosList"
		, mixins: [AppManager.BackboneMixin]
		, handleChange: function (event) {
			var el = $(event.target);

			this.props.handleCompletedChange(el.attr("data-id"), el[0].checked);
		}
		, handleClick: function (event) {
			var el = $(event.target);
			var id = el.attr("data-id");

			switch (el.attr("id")) {
				case "btnEditTodo":
					this.props.handleEditClick(id);
					break;
				case "btnDeleteTodo":
					this.props.handleDeleteClick(id);
					break;
			}
		}
		, componentDidMount: function () {
			$(this.getDOMNode()).on("change", null, this.handleChange);
			$(this.getDOMNode()).on("click", null, this.handleClick);

			this.$el.enhanceWithin();
		}
		, componentDidUpdate: function (prevProps, prevState) {
			this.$el.enhanceWithin();
		}
		, createItem: function (model, id) {
			var item = model.toJSON();
			return React.createElement("div", { key: item.id, "data-role": "controlgroup", "data-type": "horizontal" }
				, React.createElement("h3", null, item.title)
				, React.createElement("label", null, React.createElement("input", { type: "checkbox", ref: "chk_" + item.id, defaultChecked: item.completed, "data-id": item.id }), "Complete")
				, React.createElement("input", { type: "button", id: "btnEditTodo", value: "Edit", "data-id": item.id })
				, React.createElement("input", { type: "button", id: "btnDeleteTodo", value: "Delete", "data-id": item.id })
			);
		}
		, render: function () {
			return React.createElement("div", null, this.props.collection.map(this.createItem));
		}
	});

	return List;
});