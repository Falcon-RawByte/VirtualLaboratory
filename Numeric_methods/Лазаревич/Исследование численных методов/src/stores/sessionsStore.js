import {EventEmitter} from "events";
import Dispatcher from "../dispatcher.js";
import tasks from "../tasks.js";
import {SESSIONS_ACTIONS} from "../actions/sessionsActions.js";
import {taskParametersStore} from "./taskParametersStore.js";

class SessionsStore extends EventEmitter
{
	constructor()
	{
		super();
		this.sessions=this.loadSessions();
		this.currentSessions=[];
		this.initSessions();
		this.dispatchToken=Dispatcher.register(this.handleActions.bind(this));
	}
	handleActions(action)
	{
		switch(action.type)
		{

			case SESSIONS_ACTIONS.NEW_SESSION:
				{
					let taskID=taskParametersStore.getSelectedID();
					this.newSession(taskID);
					break;
				}
			case SESSIONS_ACTIONS.DELETE_SESSION:
				{
					let taskID=taskParametersStore.getSelectedID();
					this.removeSession(action.id,taskID);
					break;
				}
			case SESSIONS_ACTIONS.LOAD_SESSION:
				{
					let taskID=taskParametersStore.getSelectedID();
					this.loadSession(action.id,taskID);
					break;
				}
			case SESSIONS_ACTIONS.SAVE_SESSION:
				{
					let taskID=taskParametersStore.getSelectedID();
					this.saveCurrentSession(action.sessionName,taskID);
					break;
				}
			case SESSIONS_ACTIONS.UPDATE_SESSION:
				break;
		}
	}
	getSessions()
	{
		return this.sessions;
	}
	getCurrentSessions()
	{
		return this.currentSessions;
	}
	saveSessions()
	{
		if (typeof(Storage) !== "undefined") {
			localStorage.setItem("sessions",JSON.stringify(this.sessions));
    		// Code for localStorage/sessionStorage.
		}
		//save all sessions to local storage
	}
	loadSessions()
	{
		/*
		sessions:
		[
		{taskID,sessionArray:[
		{
			sessionName:,
			data:{
	

			}
		},
		...]},
		


		]
		*/
		let sessions=[];
		let sessionArray=new Array(tasks.length);
		sessionArray=tasks.map(function(el,index){
			return {taskID:el.taskID,sessionArray:[]};
		});
		if (typeof(Storage) !== "undefined") {
			sessions=JSON.parse(localStorage.getItem("sessions"));
    		// Code for localStorage/sessionStorage.
		}
		if(sessions==undefined)
		{
			sessions=[];
		}
		sessions.forEach(function(el,index)
			{
				let flag=false;
				for(var i=0;i<tasks.length;i++)
				{
					if(el.taskID==tasks[i].taskID)
					{
						sessionArray[i].sessionArray=sessionArray[i].sessionArray.concat(el.sessionArray);
						break;
					}
					if(flag==false)
					{
						sessionArray.push(el);
						/*let taskParameters={};
						taskParameters.argument=tasks[i].argument.default;
						taskParameters.argumentInterval=tasks[i].argumentInterval.default;
						taskParameters.parameters=tasks[i].parameters.map(function(data)
							{
								return data.default;
							});
						taskParameters.variables=tasks[i].variables.map(function(data)
							{
								return data.default;
							});
						let outputParameters={};
						outputParameters.errorMethod=0;
						outputParameters.plotInterval={left:0,right:0};
						ouputParameters.plots=[
							{value:false,name:"График ошибки"},
							{value:false,name:"График максимального модуля собственных чисел"}
						];
						tasks[i].plotInfo.forEach(function(data)
							{
								outputParameters.plots.push({value:false,name:data.description})
							});
						array[i]={methods:[],taskParameters:taskParameters,outputParameters:outputParameters};*/
					}else
					{
					}
				}
			});

		return sessionArray;
		//get sessions from local storage
		/*session=[{sessionName:string
					taskID:{methods:[],taskParameters:[],outputParameters:{}}
		},
		{sessionName:string
					data:[taskID:string,methods:[],taskParameters:[],outputParameters:{}]
		}
		]
		+ addNewSession
		*/
	}
	removeSession(id,taskID)
	{
		this.sessions[taskID].sessionArray.splice(id,1);
		this.emit("change");
	}
	initSessions()
	{
		this.currentSessions=new Array(tasks.length);
		for(var i=0;i<tasks.length;i++)
		{
			this.newSession(i);
		}
	}
	newSession(taskID)
	{

		let session={sessionName:'Новая сессия'};
		let data={};
		let i=taskID;
		let k=0;
		let taskParameters={};
		taskParameters.argument=tasks[i].argument.default;
		taskParameters.argumentInterval=tasks[i].argumentInterval.default;
		taskParameters.parameters=tasks[i].parameters.map(function(data)
		{
			return data.default;
		});
		taskParameters.variables=tasks[i].variables.map(function(data)
		{
			return data.default;
		});
		let outputParameters={};
		outputParameters.errorMethod=-1;
		outputParameters.plotInterval=[0, 0];
		outputParameters.plotDomain={t0:0,t1:1,dt:0};
		outputParameters.errorPlot=false;
		outputParameters.eigenvaluePlot=false;
		outputParameters.plots=[
		];
		tasks[i].plotInfo.forEach(function(data)
		{
			outputParameters.plots.push({value:false,name:data.description})
		});
		data={methods:[],taskParameters:taskParameters,outputParameters:outputParameters};
		session.data=data;
		this.currentSessions[taskID]=session;
		this.emit("change");
	}
	saveCurrentSession(sessionName,taskID)
	{
		if(this.sessions[taskID].sessionArray.length<8)
		{
			this.currentSessions[taskID].sessionName=sessionName;
			this.sessions[taskID].sessionArray.push(JSON.parse(JSON.stringify(this.currentSessions[taskID])));
			this.emit("change");
		}
	}
	loadSession(id,taskID)
	{
		//this.currentSession=Object.assign({},this.sessions[id]);
		this.currentSessions[taskID]=JSON.parse(JSON.stringify(this.sessions[taskID].sessionArray[id]));//what a shame, object assign cannot create deep copy
		this.emit("change");
	}
}

export const sessionsStore=new SessionsStore();
