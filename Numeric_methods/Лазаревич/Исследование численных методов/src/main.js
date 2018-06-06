import React from "react";
import ReactDOM from "react-dom";
import tasks from "./tasks.js";
import MethodPicker from "./components/methodPicker.jsx";
import SessionsList from "./components/sessionsList.jsx";
import TaskParameters from "./components/taskParameters.jsx";
import TaskBlock from "./components/taskBlock.jsx";
import OutputParameters from "./components/outputParameters.jsx";
import Output from "./components/output.jsx";
import Help from "./components/help.jsx";
import {taskParametersStore} from "./stores/taskParametersStore.js";
import {outputParametersStore} from "./stores/outputParametersStore.js";
import {methodPickerStore} from "./stores/methodPickerStore.js";
import InputNumber from "./components/InputNumber.jsx";


class App extends React.Component
{
	constructor(props)
	{
		super(props);
		this.props=props;
	}
	componentWillMount()
	{
		taskParametersStore.init();
		methodPickerStore.init();
		outputParametersStore.init();
	}
	render()
	{
		return (
			<div>
			<Help />
			<div id="applicationTitle" className="display-3 noSelect">
			Сравнение методов решения систем ОДУ
			</div>
			<SessionsList />
			<TaskBlock />
			<TaskParameters />
			<MethodPicker />
			<OutputParameters />
			<Output />
			</div>
			);

	}
}



export default App;
ReactDOM.render(<App task={0}/>,document.getElementById("cont"));