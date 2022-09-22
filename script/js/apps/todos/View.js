import _ from "lodash";
import Dispatcher from "apps/common/Dispatcher";
import { getEntity } from "apps/common/Entities";
import Form from "./Form";
import List from "./List";
import Page from "apps/common/ui/Page";

export default class TodosView extends React.Component {
	state = { collection: null }

	static propTypes = {
		name: React.PropTypes.string.isRequired,
	}

	handleFormReset = ( state ) => {
		this.setState( state );
	}

	handleListEdit = ( state ) => {
		this.setState( state );
	}

	componentDidMount() {
		// TODO: Update the query to be backend-agnostic
		getEntity( { url: this.props.name, query: "{todos{id, title, completed}}", dispatcher: new Dispatcher() }).then( result => {
			this.actionType = result.actionType;
			this.setState( { collection: result.data });
		});
	}

	componentWillUnmount() {
		this.state.collection.close();
	}

	render() {
		return (
			<Page id={ this.props.name } direction="right">
				<Form
					data={ _.omit( this.state, [ "collection" ] ) }
					collection={ this.state.collection }
					actionType={ this.actionType }
					onReset={ this.handleFormReset } />
				{this.state.collection
					? <List
						collection={ this.state.collection }
						onEdit={ this.handleListEdit } />
					: null}</Page>
		);
	}
}