import React from "react";
import SessionListItem from "./sessionListItem.jsx";
import {sessionsStore} from "../stores/sessionsStore.js";
import {sessionsActions} from "../actions/sessionsActions.js";
import {taskParametersStore} from "../stores/taskParametersStore.js";
/*
const presets=[
{presetData:{methodName:,methodParameters:{step:,minStep:,...}}},
{presetData:{}},
{presetData:{}},
];*/

class SessionsList extends React.Component
{
	constructor(props)
	{
		super(props);
		this.getSessions=this.getSessions.bind(this);
		this._saveSession=this._saveSession.bind(this);
		this._changeName=this._changeName.bind(this);
		this._newSession=this._newSession.bind(this);
		this.getTaskID=this.getTaskID.bind(this);
		this.state={sessions:sessionsStore.getSessions(),taskID:0,sessionName:""};
	}
	componentWillMount()
	{
		sessionsStore.on("change",this.getSessions);
		taskParametersStore.on("change",this.getTaskID)
	}
	componentWillUnmount()
	{
		sessionsStore.removeListener("change",this.getSessions);
		taskParametersStore.removeListener("change",this.getTaskID)
	}
	getSessions()
	{
		this.setState({sessions:sessionsStore.getSessions()});
	}
	getTaskID()
	{
		this.setState({taskID:taskParametersStore.getSelectedID()});
	}
	_newSession()
	{
		sessionsActions.newSession();
		this.setState({sessionName:""});
	}
	_changeName(e)
	{
		this.setState({sessionName:e.target.value});
	}
	_saveSession()
	{
		sessionsActions.saveSession(this.state.sessionName);
	}
	_saveFile()
	{

	}
	_loadFile()
	{


	}
	render(){
		let list=this.state.sessions[this.state.taskID].sessionArray.map(function(data,index)
		{
			return <SessionListItem key={index+"sessionsList"} sessionName={data.sessionName} id={index}/>;
		});
		return (
				<div id="sessionBlock" style={{display:'flex',flexDirection:'row'}}>
					{/*<input id="fileField" type="file" /> 
					<button className="btn btn-dark presetButton" onClick={this._saveFile}>Загрузить из файла</button>
					<button className="btn btn-dark presetButton" onClick={this._loadFile}>Сохранить в файл</button>*/}
					<div id="sessionCreationBlock" style={{display:'flex',flexDirection:'column'}}>
					<div style={{textAlign:'center'}}>Название сессии</div>
					<input type="text" value={this.state.sessionName} onChange={this._changeName}/>
					<button className="btn btn-dark presetButton" onClick={this._saveSession}>Сохранить сессию</button>
					<button className="btn btn-dark presetButton" onClick={this._newSession}>Создать новую сессию</button>
					</div>
					{list}
				</div>
			);
	}
}

module.exports=SessionsList;







