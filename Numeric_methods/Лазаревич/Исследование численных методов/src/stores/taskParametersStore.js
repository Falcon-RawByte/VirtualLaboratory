import {EventEmitter} from "events";
import Dispatcher from "../dispatcher.js";
import tasks from "../tasks.js";
import {TASK_ACTIONS} from "../actions/taskParametersActions.js";
import {SESSIONS_ACTIONS} from "../actions/sessionsActions.js";
import {sessionsStore} from "./sessionsStore.js";

class TaskParametersStore extends EventEmitter
{
	constructor()
	{
		super();
		this.dispatchToken=Dispatcher.register(this.handleActions.bind(this));
		this.init=this.init.bind(this);
		this.selectedTask=0;
		this.data=[{
		}];
	}
	init()
	{
		this.data=sessionsStore.getCurrentSessions();
	}
	getTaskMethods()
	{
		return this.data[this.selectedTask].data.methods;
	}
	getOutputParameters()
	{
		return this.data[this.selectedTask].data.outputParameters;
	}
	getSelectedID()
	{
		return this.selectedTask;
	}
	getSelectedTask()
	{
		return tasks[this.selectedTask];
	}
	getSelectedTaskParameters()
	{
		return this.data[this.selectedTask].data.taskParameters;
	}
	handleActions(action)
	{
		switch(action.type)
		{
			case TASK_ACTIONS.SELECT_TASK:
				this.selectTask(action.id);
				break;
			case TASK_ACTIONS.UPDATE_PARAMETER:
				this.updateParameter(action.name,action.value);
				break;
			case TASK_ACTIONS.UPDATE_VARIABLE:
				this.updateVariable(action.name,action.value);
				break;
			case TASK_ACTIONS.UPDATE_ARGUMENT:
				this.updateArgument(action.name,action.value);
				break;
			case SESSIONS_ACTIONS.NEW_SESSION:
			case SESSIONS_ACTIONS.LOAD_SESSION:
				Dispatcher.waitFor([sessionsStore.dispatchToken]);
				this.data=sessionsStore.getCurrentSessions();
				//this.selectedTask=0;
				this.emit("change");
		}
	}
	updateParameter(name,value)
	{
		this.data[this.selectedTask].data.taskParameters.parameters[name]=value;
		this.emit("change");
	}
	updateVariable(name,value)
	{
		this.data[this.selectedTask].data.taskParameters.variables[name]=value;
		this.emit("change");
	}
	updateArgument(name,value)
	{
		this.data[this.selectedTask].data.taskParameters[name]=value;
		this.emit("change");
	}
	selectTask(id)
	{
		if(id!=this.selectedTask)
		{
			this.selectedTask=id;
			this.emit("change");
		}
	}
}

export const taskParametersStore=new TaskParametersStore();
