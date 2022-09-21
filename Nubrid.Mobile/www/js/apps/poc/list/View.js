/*
Poc List View
*/
define(
["apps/AppManager"]
, function (AppManager) {
	var List = AppManager.module("PocApp.List");
	List.Poc = Marionette.ItemView.extend({
		initialize: function (options) {
			this.parentEl = options.region ? options.region.$el[0] : this.el;
		}
		, render: function () {
			var self = this;
			function bindModelChange(model) {
				model.bind("change", function (model) {
					self.trigger("poc:edit", model);
				});
			}
			this.collection.each(bindModelChange);
			this.listenTo(this.collection, "add", bindModelChange);

			this.view = React.render(React.createElement(Poc, { id: this.id, collection: this.collection, view: this }), this.parentEl);
			this.el = this.view.el; // HACK: Avoid conflict with Marionette region show and react render.
			AppManager.view = this.view;
			return this;
		}
	});

	var Poc = React.createClass({
		displayName: "Poc"
		, mixins: [AppManager.BackboneMixin, React.addons.LinkedStateMixin]
		, getInitialState: function () {
			return {
				id: null
				, title: ""
				, completed: false
				, sheet: 1
				, services: [
					{ serviceType: "Service Desk and/ or End User Computing", packageType: null, serviceCode: null, selected: false }
					, { serviceType: "Managed Server", packageType: null, serviceCode: null, selected: false }
					, { serviceType: "Managed Storage", packageType: null, serviceCode: null, selected: false }
					, { serviceType: "Managed Network", packageType: null, serviceCode: null, selected: false }
					, { serviceType: "Managed Unified Communications", packageType: null, serviceCode: null, selected: false }
					, { serviceType: "Add ons", packageType: null, serviceCode: null, selected: false }
				]
				, serviceDesk: {
					userVolumetric: [{ location: null, userVolume: null, operatingHours: null, supportHours: null, language: null, selected: false }]
					, hardwareVolumetric: [{ os: null, location: null, quantity: null, selected: false }]
					, tools: [{ tools: null, userVolume: null, selected: false }]
				}
				, managedServer: [{ type: null, quantity: null, technologyType: null, selected: false }]
				, managedStorage: [{ type: null, quantity: null, size: null, technologyType: null, selected: false }]
				, serviceElements: [{ serviceElement: null, languange: null, deliverables: null, serviceLevelAssociated: false, standardServiceLevel: null, maximumStretch: false, masimumStretchServiceLevel: null, overwrite: false, serviceLevelOverwrite: null, note: null }]
			};
		}
		, handleServicesChange: function (i, name, value) {
			if (!this.state.services[i]) {
				this.state.services[i] = {};
			}
			this.state.services[i][name] = value;
			this.setState(this.state.services);
		}
		, handleHOTChange: function (i, name, value, id) {
			var data = null;

			switch (id) {
				case "services":
					data = this.state.services;
					if (!data[i]) data[i] = this.getInitialState().services[0];
					break;
				case "serviceDesk.userVolumetric":
					data = this.state.serviceDesk.userVolumetric;
					if (!data[i]) data[i] = this.getInitialState().serviceDesk.userVolumetric[0];
					break;
				case "serviceDesk.hardwareVolumetric":
					data = this.state.serviceDesk.hardwareVolumetric;
					if (!data[i]) data[i] = this.getInitialState().serviceDesk.hardwareVolumetric[0];
					break;
				case "serviceDesk.tools":
					data = this.state.serviceDesk.tools;
					if (!data[i]) data[i] = this.getInitialState().serviceDesk.tools[0];
					break;
				case "managedServer":
					data = this.state.managedServer;
					if (!data[i]) data[i] = this.getInitialState().managedServer[0];
					break;
				case "managedStorage":
					data = this.state.managedStorage;
					if (!data[i]) data[i] = this.getInitialState().managedStorage[0];
					break;
			}

			if (id != "services" && data[i]["selected"] && data.length > 1) {
				data = React.addons.update(data, { $splice: [[i, 1]] });
			}
			else {
				data[i][name] = value;
			}

			switch (id) {
				case "services":
					this.state.services = data;
					this.setState(this.state.services);
					break;
				case "serviceDesk.userVolumetric":
					this.state.serviceDesk = _.extend(this.state.serviceDesk, { userVolumetric: data });
					this.setState(this.state.serviceDesk.userVolumetric);
					break;
				case "serviceDesk.hardwareVolumetric":
					this.state.serviceDesk = _.extend(this.state.serviceDesk, { hardwareVolumetric: data });
					this.setState(this.state.serviceDesk.hardwareVolumetric);
					break;
				case "serviceDesk.tools":
					this.state.serviceDesk = _.extend(this.state.serviceDesk, { tools: data });
					this.setState(this.state.serviceDesk.tools);
					break;
				case "managedServer":
					this.state.serviceDesk = _.extend(this.state.serviceDesk, { tools: data });
					this.setState(this.state.managedServer);
					break;
				case "managedStorage":
					this.state.serviceDesk = _.extend(this.state.serviceDesk, { tools: data });
					this.setState(this.state.managedStorage);
					break;
			}
		}
		, handleSubmitClick: function (event) {
			var el = $(event.target);

			var initialState = this.getInitialState();

			if (this.state.id) {
				this.props.collection.get(this.state.id).set(this.state)
			}
			else {
				this.props.view.trigger("poc:add", _.pick(_.omit(this.state, "collection"), _.keys(initialState)));
			}

			this.setState(initialState);
		}
		, handleCancelClick: function (event) {
			var initialState = this.getInitialState();
			this.setState(initialState);
		}
		, handleEditClick: function (id) {
			this.setState(_.findWhere(this.state.collection, { id: id }));
		}
		, handleDeleteClick: function (id) {
			this.props.view.trigger("poc:delete", this.props.collection.get(id));
		}
		, componentDidMount: function () {
			var self = this;
			$(this.refs.btnInput1.getDOMNode()).on("click", function () { self.setState({ sheet: 1 }); });
			$(this.refs.btnInput2.getDOMNode()).on("click", function () { self.setState({ sheet: 2 }); });
		}
		, render: function () {
			return React.createElement("div", { id: this.props.id }
				, React.createElement("div", null
					//, React.createElement(PocForm, {
					//	id: this.state.id
					//	, linkState: this.linkState
					//	, handleSubmitClick: this.handleSubmitClick
					//	, handleCancelClick: this.handleCancelClick
					//})
					//, React.createElement(PocList, {
					//	collection: this.props.collection
					//	, handleEditClick: this.handleEditClick
					//	, handleDeleteClick: this.handleDeleteClick
					//})
					, React.createElement("div", { "data-role": "controlgroup", "data-type": "horizontal" }
						, React.createElement("input", { type: "button", ref: "btnInput1", value: "Input 1" })
						, React.createElement("input", { type: "button", ref: "btnInput2", value: "Input 2" }))
					, this.state.sheet == 1 ? React.createElement(HOT, {
						id: "services"
						, data: this.state.services
						, colHeaders: [
							"Service Type"
							, "Package Type"
							, "Service Code"
							, "Select"
						]
						, columns: [
							{ data: "serviceType" }
							, {
								data: "packageType"
								, type: "dropdown"
								, source: [
									"Essential"
									, "Premier"
									, "Advanced"
									, "Custom"
								]
							}
							, { data: "serviceCode", type: "numeric" }
							, { data: "selected", type: "checkbox" }
						]
						, afterChange: this.handleHOTChange
					}) : null
					, this.state.sheet == 1 && this.state.services[0]["selected"] ? React.createElement(HOT, {
						id: "serviceDesk.userVolumetric"
						, title: this.state.services[0]["serviceType"]
						, subtitle: "User volumetric and multiple languages requirements"
						, data: this.state.serviceDesk.userVolumetric
						, minSpareRows: 1
						, colHeaders: [
							"Location"
							, "User Volume"
							, "Operating Hours"
							, "Support Hours"
							, "Language"
							, "Remove"
						]
						, columns: [
							{
								data: "location"
								, type: "autocomplete"
								, source: [
									"China"
									, "Japan"
									, "Malaysia"
								]
							}
							, { data: "userVolume", type: "numeric" }
							, { data: "operatingHours" }
							, {
								data: "supportHours"
								, type: "dropdown"
								, source: [
									"9x5"
									, "12x5"
									, "12x7"
								]
							}
							, {
								data: "language"
								, type: "autocomplete"
								, source: [
									"English"
									, "Cantonese"
									, "Mandarin"
									, "Japanese"
								]
								, strict: false
							}
							, { data: "selected", type: "checkbox" }
						]
						, afterChange: this.handleHOTChange
					}) : null
					, this.state.sheet == 1 && this.state.services[0]["selected"] ? React.createElement(HOT, {
						id: "serviceDesk.hardwareVolumetric"
						, subtitle: "Hardware volumetric"
						, data: this.state.serviceDesk.hardwareVolumetric
						, minSpareRows: 1
						, colHeaders: [
							"Operating System"
							, "Location"
							, "Quantity"
							, "Remove"
						]
						, columns: [
							{
								data: "os"
								, type: "autocomplete"
								, source: [
									"Windows 8"
									, "Windows 7"
									, "Windows XP"
									, "Linux"
								]
							}
							, {
								data: "location"
								, type: "autocomplete"
								, source: [
									"China"
									, "Japan"
									, "Malaysia"
								]
							}
							, { data: "quantity", type: "numeric" }
							, { data: "selected", type: "checkbox" }
						]
						, afterChange: this.handleHOTChange
					}) : null
					, this.state.sheet == 1 && this.state.services[0]["selected"] ? React.createElement(HOT, {
						id: "serviceDesk.tools"
						, data: this.state.serviceDesk.tools
						, minSpareRows: 1
						, colHeaders: [
							"Tools"
							, "User Volume"
							, "Remove"
						]
						, columns: [
							{
								data: "Tools"
								, type: "autocomplete"
								, source: [
									"Miradore"
									, "ActivateLive"
									, "ITSM (full)"
									, "ITSM (IM only)"
								]
							}
							, { data: "userVolume", type: "numeric" }
							, { data: "selected", type: "checkbox" }
						]
						, afterChange: this.handleHOTChange
					}) : null
					, this.state.sheet == 1 && this.state.services[1]["selected"] ? React.createElement(HOT, {
						id: "managedServer"
						, title: "Managed Server"
						, subtitle: "Volumetric"
						, data: this.state.managedServer
						, minSpareRows: 1
						, colHeaders: [
							"Type"
							, "Quantity"
							, "Technology Type"
							, "Remove"
						]
						, columns: [
							{
								data: "type"
								, type: "autocomplete"
								, source: [
									"Windows 2012"
									, "RHEL 6"
									, "Unix - Solaris 11"
								]
							}
							, { data: "quantity", type: "numeric" }
							, {
								data: "technologyType"
								, type: "dropdown"
								, source: [
									"Standard"
									, "Custom"
								]
							}
							, { data: "selected", type: "checkbox" }
						]
						, afterChange: this.handleHOTChange
					}) : null
					, this.state.sheet == 1 && this.state.services[2]["selected"] ? React.createElement(HOT, {
						id: "managedStorage"
						, title: "Managed Storage"
						, subtitle: "Volumetric"
						, data: this.state.managedStorage
						, minSpareRows: 1
						, colHeaders: [
							"Storage Type"
							, "Quantity of storage array"
							, "Storage usable size (in TB)"
							, "Technology Type"
							, "Remove"
						]
						, columns: [
							{
								data: "type"
								, type: "autocomplete"
								, source: [
									"EMC"
									, "NetApp"
									, "HP p2000"
								]
							}
							, { data: "quantity", type: "numeric" }
							, { data: "size", type: "numeric" }
							, {
								data: "technologyType"
								, type: "dropdown"
								, source: [
									"Standard"
									, "Custom"
								]
							}
							, { data: "selected", type: "checkbox" }
						]
						, afterChange: this.handleHOTChange
					}) : null
					, this.state.sheet == 2 && this.state.services[0]["selected"] ? React.createElement(HOT, {
						id: "serviceDesk"
						, title: "1) Services"
						, subtitle: "1a) " + this.state.services[0]["serviceType"]
						, data: this.state.serviceElements
						, minSpareRows: 1
						, colHeaders: [
							"Service Element"
							, "Language"
							, "Deliverables"
							, "Service Level Associated?"
							, "Standard Service Level"
							, "Maximum Stretch (Y/N)"
							, "Maximum Stretch Service Level"
							, "Overwrite? (Y/N)"
							, "Service Level Overwrite"
							, "Note"
							, "Remove"
						]
						, columns: [
							{ data: "serviceElement" }
							, { data: "language" }
							, { data: "deliverables" }
							, { data: "serviceLevelAssociated", type: "checkbox" }
							, { data: "standardServiceLevel" }
							, { data: "maximumStretch", type: "checkbox" }
							, { data: "maximumStretchServiceLevel" }
							, { data: "overwrite", type: "checkbox" }
							, { data: "serviceLevelOverwrite" }
							, { data: "note" }
						]
						, afterChange: this.handleHOTChange
					}) : null
					, this.state.sheet == 2 && this.state.services[1]["selected"] ? React.createElement(HOT, {
						id: "managedServer"
						, subtitle: "1b) " + this.state.services[1]["serviceType"]
						, data: this.state.serviceElements
						, minSpareRows: 1
						, colHeaders: [
							"Service Element"
							, "Language"
							, "Deliverables"
							, "Service Level Associated?"
							, "Standard Service Level"
							, "Maximum Stretch (Y/N)"
							, "Maximum Stretch Service Level"
							, "Overwrite? (Y/N)"
							, "Service Level Overwrite"
							, "Note"
							, "Remove"
						]
						, columns: [
							{ data: "serviceElement" }
							, { data: "language" }
							, { data: "deliverables" }
							, { data: "serviceLevelAssociated", type: "checkbox" }
							, { data: "standardServiceLevel" }
							, { data: "maximumStretch", type: "checkbox" }
							, { data: "maximumStretchServiceLevel" }
							, { data: "overwrite", type: "checkbox" }
							, { data: "serviceLevelOverwrite" }
							, { data: "note" }
						]
						, afterChange: this.handleHOTChange
					}) : null
					, this.state.sheet == 2 && this.state.services[2]["selected"] ? React.createElement(HOT, {
						id: "managedStorage"
						, subtitle: "1c) " + this.state.services[2]["serviceType"]
						, data: this.state.serviceElements
						, minSpareRows: 1
						, formulas: true
						, colHeaders: [
							"Service Element"
							, "Language"
							, "Deliverables"
							, "Service Level Associated?"
							, "Standard Service Level"
							, "Maximum Stretch (Y/N)"
							, "Maximum Stretch Service Level"
							, "Overwrite? (Y/N)"
							, "Service Level Overwrite"
							, "Note"
							, "Remove"
						]
						, columns: [
							{ data: "serviceElement" }
							, { data: "language" }
							, { data: "deliverables" }
							, { data: "serviceLevelAssociated", type: "checkbox" }
							, { data: "standardServiceLevel" }
							, { data: "maximumStretch", type: "checkbox" }
							, { data: "maximumStretchServiceLevel" }
							, { data: "overwrite", type: "checkbox" }
							, { data: "serviceLevelOverwrite" }
							, { data: "note" }
						]
						, afterChange: this.handleHOTChange
					}) : null
				)
			);
		}
	});

	var PocForm = React.createClass({
		displayName: "PocForm"
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
				, React.createElement("label", null, this.props.id ? "Edit Poc" : "Create a new Poc")
				, React.createElement("input", { type: "hidden", value: this.props.id })
				, React.createElement("input", { type: "text", valueLink: this.props.linkState("title") })
				, React.createElement("input", { type: "button", ref: "btnSubmit", value: this.props.id ? "Update" : "Add" })
				, this.props.id ? React.createElement("input", { type: "button", ref: "btnCancel", value: "Cancel" }) : null
			);
		}
	});

	var PocList = React.createClass({
		displayName: "PocList"
		, mixins: [AppManager.BackboneMixin]
		, handleChange: function (event) {
			var el = $(event.target);

			this.props.collection.get(el.attr("data-id")).set("completed", el[0].checked);
		}
		, handleClick: function (event) {
			var el = $(event.target);
			var id = el.attr("data-id");

			switch (el.attr("id")) {
				case "btnEditPoc":
					this.props.handleEditClick(id);
					break;
				case "btnDeletePoc":
					this.props.handleDeleteClick(id);
					break;
			}
		}
		, componentDidMount: function () {
			$(this.getDOMNode()).on("change", null, this.handleChange);
			$(this.getDOMNode()).on("click", null, this.handleClick);
		}
		, componentDidUpdate: function (prevProps, prevState) {
			this.$el.enhanceWithin();
		}
		, createItem: function (item, id) {
			return React.createElement("div", { key: item.id, "data-role": "controlgroup", "data-type": "horizontal" }
				, React.createElement("h3", null, item.title)
				, React.createElement("label", null, React.createElement("input", { type: "checkbox", defaultChecked: item.completed, "data-id": item.id }), "Complete")
				, React.createElement("input", { type: "button", id: "btnEditPoc", value: "Edit", "data-id": item.id })
				, React.createElement("input", { type: "button", id: "btnDeletePoc", value: "Delete", "data-id": item.id })
			);
		}
		, render: function () {
			return React.createElement("div", null, this.state.collection.map(this.createItem));
		}
	});

	var HOT = React.createClass({
		displayName: "HOT"
		, mixins: [AppManager.BackboneMixin]
		, afterChange: function (changes, source) {
			if (changes) {
				for (var i in changes) {
					var change = changes[i];

					this.props.afterChange(change[0], change[1], change[3], this.props.id);
				}
			}
		}
		, componentDidMount: function () {
			this.renderTable();
		}
		, componentDidUpdate: function (prevProps, prevState) {
			this.renderTable();
		}
		, renderTable: function () {
			$(this.refs.tblHOT.getDOMNode()).handsontable({
				data: this.props.data
				, minSpareRows: this.props.minSpareRows ? this.props.minSpareRows : 0
				, rowHeaders: this.props.rowHeaders
				, colHeaders: this.props.colHeaders
				, contextMenu: this.props.contextMenu
				, formulas: this.props.formulas
				, columns: this.props.columns
				, afterChange: this.afterChange
			});
		}
		, render: function () {
			return React.createElement("div", null
				, this.props.title ? React.createElement("h3", null, this.props.title) : null
				, this.props.subtitle ? React.createElement("h4", null, this.props.subtitle) : null
				, React.createElement("div", { ref: "tblHOT" }));
		}
	});

	return List;
});