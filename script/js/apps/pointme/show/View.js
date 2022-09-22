/*
PointMe Show View
*/
define(
["apps/AppManager"
, "apps/common/View"
, "entities/Common"]
, function (AppManager, CommonView, CommonEntity) {
	"use strict";
	var List = {};

	var _pointme = React.createClass({
		displayName: "PointMe"
		, getInitialState: function () {
			return {
				id: -1
				, title: ""
				, completed: false
			};
		}
		, handleChange: function (event) {
			this.setState({ title: event.target.value });
		}
		, handleSubmitClick: function () {
			var initialState = this.getInitialState();
			var attrs = _.pick(_.omit(this.state, "collection"), _.keys(initialState));

			this.props.view.trigger(attrs.id > 0 ? this.actionType.UPDATE : this.actionType.CREATE, attrs);

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
			var entity = AppManager.request("entity", { url: this.props.id, query: "{todos{id, title, completed}}", dispatcher: this.props.view.options.dispatcher });
			// this.props.view.dispatcher = entity.dispatcher; // Need to set this so that the Controller can properly dispatch.
			this.actionType = entity.actionType;

			$.when(entity.fetch).done($.proxy(function (pointme) {
				this.setState({ collection: pointme });
			}, this));
		}
		, componentWillUnmount: function () {
			this.state.collection.close();
		}
		, render: function () {
			return React.createElement(React.addons.CSSTransitionGroup, AppManager.getTransition({ "data-role": "page", id: this.props.id, component: "div", className: "bounceInRight" })
				, React.createElement("div", { role: "main", className: "ui-content" }
					, React.createElement(List.React.PointMeForm, {
						id: this.state.id
						, title: this.state.title
						, handleChange: this.handleChange
						, handleSubmitClick: this.handleSubmitClick
						, handleCancelClick: this.handleCancelClick
					})
					, React.createElement(List.React.PointMeList, {
						collection: this.state.collection
						, view: this.props.view
						, handleEditClick: this.handleEditClick
					})
				)
			);
		}
	});

	var _pointmeForm = React.createClass({
		displayName: "PointMeForm"
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
				, React.createElement("input", { type: "text", value: this.props.title, onChange: this.props.handleChange })
				, CommonView.UI.button({ ref: CommonView.UI.ref("btnSubmit", this), value: this.props.id > 0 ? "Update" : "Add" })
				, this.props.id > 0 ? CommonView.UI.button({ ref: CommonView.UI.ref("btnCancel", this), value: "Cancel" }) : null
			);
		}
	});

	var _pointmeList = React.createClass({
		displayName: "PointMeList"
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

			this.$el.enhanceWithin();
		}
		, componentDidUpdate: function (prevProps, prevState) {
			if ((this.wrapper.nextState && this.wrapper.nextState.collection.length > prevState.collection.length) || !prevState.collection) {
				this.$el.enhanceWithin();
			}
			else {
				var checkbox = null;
				_.each(this.wrapper.collection.models, function (model) {
					if (typeof model.changed.completed === "undefined") return;
					checkbox = $(this.refs["chk_" + model.id]);
					checkbox[0].checked = model.changed.completed;
					checkbox.checkboxradio("refresh");
				}, this);
			}
			// TODO: No longer works at backbone-react-component v0.10.0
			//else if (!prevState.isRequesting && this.wrapper.nextState) {
			//	var nextCollection = this.wrapper.nextState.collection;
			//	var checkbox = null;
			//	_.each(_.filter(nextCollection, function (model) {
			//		return !_.isEqual(model.completed, _.findWhere(prevState.collection, { id: model.id }).completed);
			//		// TODO: If you need to compare all attributes.
			//		//return !_.isEqual(model, _.findWhere(prevState.collection, { id: model.id }));
			//	}), $.proxy(function (model) {
			//		checkbox = $(this.refs["chk_" + model.id]);
			//		checkbox[0].checked = model.completed;
			//		checkbox.checkboxradio("refresh");
			//	}, this));
			//}
		}
		, createItem: function (item) {
			return React.createElement("div", { key: item.id, "data-role": "controlgroup", "data-type": "horizontal" }
				, React.createElement("h3", null, item.title)
				, React.createElement("label", null, React.createElement("input", { type: "checkbox", ref: "chk_" + item.id, defaultChecked: item.completed, "data-id": item.id }), "Complete")
				, React.createElement("input", { type: "button", id: "btnEditTodo", value: "Edit", "data-id": item.id })
				, React.createElement("input", { type: "button", id: "btnDeleteTodo", value: "Delete", "data-id": item.id })
			);
		}
		, render: function () {
			return React.createElement(React.addons.CSSTransitionGroup, AppManager.Transition.ListItem
				, this.state.collection ? this.state.collection.map(this.createItem) : null);
		}
	});

	List.React = {
		PointMe: _pointme
		, PointMeForm: _pointmeForm
		, PointMeList: _pointmeList
	};

	List.Content = CommonView.Content.extend({
		ReactClass: List.React.PointMe
	});

	return List;
});