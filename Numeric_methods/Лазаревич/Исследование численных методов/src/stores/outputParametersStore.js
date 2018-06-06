import {EventEmitter} from "events";
import Dispatcher from "../dispatcher.js";
import {OUTPUT_PARAMETERS_ACTIONS} from "../actions/outputParametersActions.js";
import {METHOD_PICKER_ACTIONS} from "../actions/methodPickerActions.js";
import {TASK_ACTIONS} from "../actions/taskParametersActions.js";
import {SESSIONS_ACTIONS} from "../actions/sessionsActions.js";
import {taskParametersStore} from "./taskParametersStore.js";
import {methodPickerStore} from "./methodPickerStore.js";
import {sessionsStore} from "./sessionsStore.js";

class OutputParametersStore extends EventEmitter
{
	constructor()
	{
		super();
		this.dispatchToken=Dispatcher.register(this.handleActions.bind(this));
		this.init=this.init.bind(this);
		this.parameters={};
		this.task={};
		this.methods=[];
	}
	init()
	{
		this.parameters=taskParametersStore.getOutputParameters();
		this.task=taskParametersStore.getSelectedTask();
		this.taskParameters=taskParametersStore.getSelectedTaskParameters();
		this.methods=methodPickerStore.getMethods();
		this.plotInterval(this.methods,this.taskParameters.argument,this.taskParameters.argumentInterval,this.task.variables.length);
				
	}
	getParameters()
	{
		return this.parameters;
	}
	handleActions(action)
	{
		switch(action.type)
		{
			case OUTPUT_PARAMETERS_ACTIONS.UPDATE_PARAMETER:
				this.updateParameter(action.name,action.value);
				break;
			case OUTPUT_PARAMETERS_ACTIONS.UPDATE_PLOTS:
				this.updatePlots(action.name,action.value);
				break;
			case SESSIONS_ACTIONS.NEW_SESSION:
			case SESSIONS_ACTIONS.LOAD_SESSION:
			case SESSIONS_ACTIONS.LOAD_FILE:
				Dispatcher.waitFor([sessionsStore.dispatchToken,taskParametersStore.dispatchToken]);
				this.parameters=taskParametersStore.getOutputParameters();
				this.task=taskParametersStore.getSelectedTask();
				this.taskParameters=taskParametersStore.getSelectedTaskParameters();
				this.emit("change");
				break;
			case TASK_ACTIONS.SELECT_TASK:
				Dispatcher.waitFor([taskParametersStore.dispatchToken]);
				this.parameters=taskParametersStore.getOutputParameters();
				this.task=taskParametersStore.getSelectedTask();
				this.taskParameters=taskParametersStore.getSelectedTaskParameters();
				this.plotInterval(this.methods,this.taskParameters.argument,this.taskParameters.argumentInterval,this.task.variables.length);
				
				this.emit("change");
				break;
			case TASK_ACTIONS.UPDATE_ARGUMENT:
				Dispatcher.waitFor([taskParametersStore.dispatchToken]);
				this.task=taskParametersStore.getSelectedTask();
				this.taskParameters=taskParametersStore.getSelectedTaskParameters();
				this.plotInterval(this.methods,this.taskParameters.argument,this.taskParameters.argumentInterval,this.task.variables.length);
				
				this.emit("change");
				break;
			case METHOD_PICKER_ACTIONS.ADD_METHOD:
			case METHOD_PICKER_ACTIONS.REMOVE_METHOD:
			case METHOD_PICKER_ACTIONS.UPDATE_METHOD:
				Dispatcher.waitFor([methodPickerStore.dispatchToken]);
				this.methods=methodPickerStore.getMethods();
				this.plotInterval(this.methods,this.taskParameters.argument,this.taskParameters.argumentInterval,this.task.variables.length);
				this.emit("change");
				break;
		}
	}
	plotInterval(methods,t0,dt,systemSize)
	{
		let t=0;
		let mem=8*1024*1024/(8*(systemSize+1));
		let t0i=parseFloat(t0);
		let t1i=t0i+parseFloat(dt);
		for(var i=0;i<methods.length;i++)
		{
			let p=parseFloat(methods[i].parameters.stepValue)/1000.0;
			if(isNaN(p))
			{
				let pd=this.parameters.plotDomain=isNaN(t0i)||isNaN(t1i)||isNaN(dtn)||t0>=t1i?{t0:0,t1:1,dt:0}:{t0:t0i,t1:t1i,dt:0};
				return;
			}
			t+=1.0/p;
		}
		let dtn=mem/t;
		let pd=this.parameters.plotDomain=isNaN(t0i)||isNaN(t1i)||isNaN(dtn)||t0>=t1i?{t0:0,t1:1,dt:0}:{t0:t0i,t1:t1i,dt:dtn};
	}
	updatePlots(name,value)
	{
		this.parameters.plots[name]=value;
		this.emit("change");
	}
	updateParameter(name,value)
	{
		this.parameters[name]=value;
		this.emit("change");
	}
	calcInterval(memory,steps)
	{
		//return ;

		let k=memory*1024*1024/8+1;
		let p=0;
		for(var i=0;i<steps.length;i++)
			p+=steps[i];
		return k/p;
		//batchInterval=   k/(sum(1/dtmin[i]));

	}
}


export const outputParametersStore=new OutputParametersStore();