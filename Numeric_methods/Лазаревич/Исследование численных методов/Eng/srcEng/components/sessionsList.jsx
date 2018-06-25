import React from "react";
import SessionListItem from "./sessionListItem.jsx";
import {sessionsStore} from "../stores/sessionsStore.js";
import {sessionsActions} from "../actions/sessionsActions.js";
import {taskParametersStore} from "../stores/taskParametersStore.js";
import tasks from "../tasks.js";
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
		this._loadFile=this._loadFile.bind(this);
		this._saveFile=this._saveFile.bind(this);
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
		var data=this.state.sessions;
		var blob = new Blob([JSON.stringify(data)], { type: 'text/plain' });
		var anchor = document.createElement('a');
		anchor.download = "VirtLabsSave.txt";
		anchor.href = (window.webkitURL || window.URL).createObjectURL(blob);
		anchor.dataset.downloadurl = ['text/plain', anchor.download, anchor.href].join(':');
        let url = URL.createObjectURL(blob);
        document.body.appendChild(anchor);
        anchor.click();
        setTimeout(function() {
            document.body.removeChild(anchor);
            window.URL.revokeObjectURL(url);  
        }, 0); 
	}
	_loadFile(e)
	{
		e.stopPropagation();
   		e.preventDefault();
   		var file = e.target.files[0];
		if (!file) {
			return;
		}
		var reader = new FileReader();
		reader.onload = function(e) {
		    var contents = e.target.result;
			sessionsActions.loadFile(contents);
		};
		reader.readAsText(file);
	}
	render(){
		let list=this.state.sessions[this.state.taskID].sessionArray.map(function(data,index)
		{
			return <SessionListItem key={index+"sessionsList"} sessionName={data.sessionName} id={index}/>;
		});
		return (
			<div id="sessionBlock">
				<div id="sessionBlockLabel" className="componentLabel">
				Parameter's presets
				</div>
				<div id="sessionListBlock" style={{display:'flex',flexDirection:'row'}}>
					<div style={{borderRight:'2px solid black'}}>
						<div className="sessionCreationBlock" style={{display:'flex',flexDirection:'column'}}>
							<div className="noSelect" style={{textAlign:'center'}}>Preset name</div>
							<input type="text" value={this.state.sessionName} onChange={this._changeName}/>
							<button className="btn btn-primary presetButton" onClick={this._saveSession}>Add preset</button>
							<button className="btn btn-primary presetButton" onClick={this._newSession}>Reset parameters</button>
						</div>
						<div className="sessionCreationBlock" style={{display:'flex',flexDirection:'column',borderTop:'2px solid black'}}>
								<label className="btn btn-primary presetButton" htmlFor="fileField">Load from file</label>
								<input id="fileField" type="file" onChange={this._loadFile} style={{display:'none'}}/>
								<button className="btn btn-primary presetButton" onClick={this._saveFile}>Save to file</button>
						</div>
					</div>
					{list}
				</div>
			</div>
			);
	}
}

module.exports=SessionsList;







