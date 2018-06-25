import React from "react";
import {taskParametersStore} from "../stores/taskParametersStore.js";
import {taskParametersActions} from "../actions/taskParametersActions.js";
import InputNumber from "./InputNumber.jsx";
//import from methods


class TaskParameters extends React.Component
{
	constructor(props)
	{
		super(props);
		this.state={data:taskParametersStore.getSelectedTaskParameters(),task:taskParametersStore.getSelectedTask()};
		this._updateParameter=this._updateParameter.bind(this);
		this._updateArgument=this._updateArgument.bind(this);
		this._updateVariable=this._updateVariable.bind(this);
		this.getParameters=this.getParameters.bind(this);
	}
	componentWillMount()
	{
		taskParametersStore.on("change",this.getParameters);
	}
	componentWillUnmoun()
	{
		taskParametersStore.removeListener("change",this.getParameters);
	}
	getParameters()
	{
		this.setState({data:taskParametersStore.getSelectedTaskParameters(),task:taskParametersStore.getSelectedTask()});
	}
	_updateParameter(e)
	{
		let name=e.target.name;
		let value= e.target.value;
		taskParametersActions.updateParameter(name,value);
	}
	_updateArgument(e)
	{
		let name=e.target.name;
		let value= e.target.value;
		taskParametersActions.updateArgument(name,value);
	}
	_updateVariable(e)
	{
		let name=e.target.name;
		let value= e.target.value;
		taskParametersActions.updateVariable(name,value);
	}
	render()
	{
		let params=[];
		let self=this;
		this.state.data.parameters.forEach(function(data,index)
		{
			let attr=self.state.task.parameters[index];
			params.push(<div className="table_row" key={index+"_parameterDiv"}>
				<label className="table_label" key={index+"_parameterLabel"} >{attr.description}</label>
				<InputNumber className="table_input" onChange={self._updateParameter} type="number" value={data} name={index} key={index+"_parameterInput"} step={attr.step} min={attr.min} max={attr.max} />
					</div>);
		});
		let variables=[];
		this.state.data.variables.forEach(function(data,index)
		{
			let attr=self.state.task.variables[index];
			variables.push(<div className="table_row" key={index+"_variableDiv"}>
				<label className="table_label" key={index+"_variableLabel"} >{attr.description}</label>
				<InputNumber className="table_input" onChange={self._updateVariable} type="number" value={data} name={index} key={index+"_variableInput"} step={attr.step} min={attr.min} max={attr.max} />
					</div>)
			//variables.push();
		});
		let data=this.state.task;
		return (	
				<div id="taskParametersBlock">
				{	params.length!=0&&
					<div>
					<div id="taskParameters" className="componentLabel">Parameters of system</div>
						<div style={{display:'table',borderSpacing:'5px'}}>
						<div className="table_row_group">
							{params}
						</div>
						</div>
						</div>
				}
					<div id="taskInitials" className="componentLabel">Initial conditions and argument interval</div>
					<div style={{display:'table',borderSpacing:'5px'}}>
					<div className="table_row_group">
					{variables}
					<div className="table_row">
					<label className="table_label">{data.argument.description}</label>
					<InputNumber className="table_input" onChange={this._updateArgument} type="number" name="argument" id="argument" value={this.state.data.argument} step={data.argument.step} min={data.argument.min} max={data.argument.max}/>
					</div>
					<div className="table_row">
					<label className="table_label">{data.argumentInterval.description}</label>
					<InputNumber className="table_input" onChange={this._updateArgument} type="number" name="argumentInterval" id="argumentInterval" value={this.state.data.argumentInterval} step={data.argument.step} min={data.argument.min} max={data.argument.max}/>
					</div>
					</div>
					</div>
				</div>
			);
	}
}

module.exports=TaskParameters;