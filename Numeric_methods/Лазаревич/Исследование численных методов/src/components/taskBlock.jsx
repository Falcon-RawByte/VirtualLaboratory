import React from "react";
import tasks from "../tasks.js";
import {taskParametersStore} from "../stores/taskParametersStore.js";
import {taskParametersActions} from "../actions/taskParametersActions.js";

class TaskBlock extends React.Component
{
	constructor(props)
	{
		super(props);
		this.getSelectedTask=this.getSelectedTask.bind(this);
		this.state={selectedID:taskParametersStore.getSelectedID()};
	}
	getSelectedTask()
	{
		this.setState({selectedID:taskParametersStore.getSelectedID()});
	}
	componentWillMount()
	{
		taskParametersStore.on("change",this.getSelectedTask);
	}
	componentWillUnmount()
	{
		taskParametersStore.removeListener("change",this.getSelectedTask);
	}
	selectTask(e)
	{
		taskParametersActions.selectTask(e.currentTarget.getAttribute('name'));
	}
	render(){
		let self=this;
		let elements=tasks.map(function(data,index){
			return <div className={"list-group-item list-group-item-action taskListElement"+(index==self.state.selectedID?" active":"")} key={index+"_taskList"} name={index}  onClick={self.selectTask}>
				<div>{(index+1)+". "+data.taskInfo.name}</div>
			</div>;
		});
		return (<div id="taskBlock">
				<div id="taskBlockLabel" className="componentLabel">Выбор задачи</div>
				<div id="taskList">
				<ul className="list-group list-group-flush">
				{elements}
				</ul>
				</div>
				<div id="taskDescriptionLabel" className="componentLabel">Описание задачи</div>
				<div id="taskDescription" dangerouslySetInnerHTML={{__html: tasks[this.state.selectedID].taskInfo.description}}>
					
				</div>
			</div>
			);
	}
}


module.exports=TaskBlock;