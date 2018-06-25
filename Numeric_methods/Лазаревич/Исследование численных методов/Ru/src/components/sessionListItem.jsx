import React from "react";
import {sessionsActions} from "../actions/sessionsActions.js";


class SessionListItem extends React.Component
{
	constructor(props)
	{
		super(props);
		this._load=this._load.bind(this);
		this._delete=this._delete.bind(this);
	}
	_load()
	{
		sessionsActions.loadSession(this.props.id);
	}
	_delete()
	{
		sessionsActions.deleteSession(this.props.id);
	}
	render(){
		return (
					<div id="preset1" className="presetBlock">
						<div className="presetName">
							{this.props.sessionName}
						</div>
						<div className="presetButtonContainer">
							<button type="button" className="btn btn-primary presetButton" onClick={this._load}>Загрузить</button>
							<button type="button" className="btn btn-danger presetButton" onClick={this._delete}>Удалить</button>
						</div>
					</div>
			);
	}
}


module.exports=SessionListItem;



