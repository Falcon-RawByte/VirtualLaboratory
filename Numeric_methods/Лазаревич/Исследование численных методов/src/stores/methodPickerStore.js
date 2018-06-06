import {EventEmitter} from "events";
import {Methods} from "../methods.js";
//import defaultParameters from "./components/methodParameters.jsx";
import Dispatcher from "../dispatcher.js";
import {METHOD_PICKER_ACTIONS} from "../actions/methodPickerActions.js";
import tasks from "../tasks.js";
import {taskParametersStore} from "./taskParametersStore.js";
import {TASK_ACTIONS} from "../actions/taskParametersActions.js";
import {SESSIONS_ACTIONS} from "../actions/sessionsActions.js";
import {sessionsStore} from "./sessionsStore.js";

export const colors=["#E600CE","#0014AF","#00C13A","#F6D444"];

/*
https://codeburst.io/reactjs-for-noobs-ii-flux-5355adb33dad
https://code.tutsplus.com/ru/tutorials/getting-started-with-the-flux-architecture-in-react--cms-28906
https://metanit.com/web/react/5.1.php
https://reactjs.org/blog/2014/07/30/flux-actions-and-the-dispatcher.html
http://www.madebymany.com/stories/beyond-the-to-do-app-writing-complex-applications-using-flux-react-js
https://medium.com/capital-one-developers/how-to-work-with-forms-inputs-and-events-in-react-c337171b923b
*/

export const dependOnTask=
{
	errorMax:0.01,
	stepMin:1,
	stepMax:1000,
	jacobianAnalythicEnabled:false

};
export const dependOnMethod=
{
	autoStepEnabled:false,
	chooseOrderEnabled:false,
	jacobianMatrixEnabled:false,
	minOrder:1,
	maxOrder:1
};

export const defaultParameters=
{
	errorValue:0.01,
	maxstepValue:20,
	stepValue:20,
	selectedMethod:0,
	selectedOrder:1,
	jacobianSelected:1,
	useConstMatrix:false
};



class MethodPickerStore extends EventEmitter
{
	constructor()
	{
		super();
		this.dispatchToken=Dispatcher.register(this.handleActions.bind(this));
		this.init=this.init.bind(this);
		this.methods=[];
		this.colorPool=[0,1,2,3];
		this.selectedMethod=-1;
		this.selectedTask=tasks[0];
		this.dependOnTask=dependOnTask;
		this.defaultParameters=defaultParameters;
	}
	init()
	{
		this.methods=taskParametersStore.getTaskMethods();
		this.selectedTask=taskParametersStore.getSelectedTask();
		this.setParameters();
	}
	selectMethod(id)
	{
		if(this.selectedMethod!=id)
		{
			this.selectedMethod=(id>this.methods.length ? -1 : id);
			this.emit("change");
		}
	}
	setParameters()
	{
		this.dependOnTask=Object.assign({},dependOnTask);
		this.defaultParameters=Object.assign({},defaultParameters);
		let mA=this.selectedTask.methodsAttributes;
		if(mA!==undefined)
		{
			for(var propertyName in this.dependOnTask) {
				if(mA[propertyName]!==undefined)
				{
					this.dependOnTask[propertyName]=mA[propertyName];
				}
			}

			for(var propertyName in this.defaultParameters) {
				if(mA[propertyName]!==undefined)
				{
					this.defaultParameters[propertyName]=mA[propertyName];
				}
			}
		}
	}
	handleActions(action)
	{
		switch(action.type)
		{
				case METHOD_PICKER_ACTIONS.SELECT_METHOD:
					this.selectMethod(action.id);
					break;
				case METHOD_PICKER_ACTIONS.ADD_METHOD:
					this.addMethodListItem();
					break;
				case METHOD_PICKER_ACTIONS.REMOVE_METHOD:
					this.removeMethodListItem(action.id);
					break;
				case METHOD_PICKER_ACTIONS.UPDATE_METHOD:
					this.updateMethod(action.id,action.name,action.value);
					break;
				case SESSIONS_ACTIONS.NEW_SESSION:
				case SESSIONS_ACTIONS.LOAD_SESSION:
				case SESSIONS_ACTIONS.LOAD_FILE:
					Dispatcher.waitFor([sessionsStore.dispatchToken,taskParametersStore.dispatchToken]);
					this.methods=taskParametersStore.getTaskMethods();
					this.selectedTask=taskParametersStore.getSelectedTask();
					this.seParameters();
					this.selectedMethod=-1;
					this.emit("change");
					break;
				case TASK_ACTIONS.SELECT_TASK:
					Dispatcher.waitFor([taskParametersStore.dispatchToken]);
					this.methods=taskParametersStore.getTaskMethods();
					this.selectedTask=taskParametersStore.getSelectedTask();
					this.setParameters();
					this.selectedMethod=-1;
					this.emit("change");
					break;
		}
	}
	addMethodListItem()
	{
		if(this.methods.length==4)
			return;
		//var id=this.colorPool.pop();
		this.methods.push({colorId:0,parameters:Object.assign({}, this.defaultParameters)});
		this.emit("change");
	}
	removeMethodListItem(id)
	{
		if(id==this.selectedMethod)
			this.selectedMethod=-1;
		else if(id<this.selectedMethod)
		{
			this.selectedMethod=this.selectedMethod-1;
		}
		//this.colorPool.push(this.methods[id].colorId);
		this.methods.splice(id,1);
		this.emit("change");
	}
	clearMethodList()
	{
		/*for(var i=0;i<this.methods.length;i++)
			this.colorPool.push(this.methods[i].colorId);*/
		this.methods.splice(0,this.methods.length);
		this.emit("change");
	}
	updateMethod(id,name,value)
	{
		this.methods[id].parameters[name]=value;
		this.emit("change");
	}
	getParameters()
	{
		return this.dependOnTask;
	}
	getSelectedMethod()
	{
		return this.selectedMethod;
	}
	getMethods()
	{
		return this.methods;
	}
	getMethodListNames()
	{
		return this.methods.map(function(data,index){return Methods[data.parameters.selectedMethod].attributes.name;});
	}
}


export const methodPickerStore=new MethodPickerStore();
export {Methods};
