import Dispatcher from "../dispatcher.js";



export const SESSIONS_ACTIONS=
{
	NEW_SESSION:"NEW_SESSION",
	DELETE_SESSION:"DELETE_SESSION",
	LOAD_SESSION:"LOAD_SESSION",
	SAVE_SESSION:"SAVE_SESSION",
	UPDATE_SESSION:"UPDATE_SESSION",
	LOAD_FILE:"LOAD_FILE"
};

class SessionsActions{

	newSession()//create and load empty session
	{
		Dispatcher.dispatch(
		{
			type:SESSIONS_ACTIONS.NEW_SESSION
		});
	}
	deleteSession(id)//delete choosen session
	{
		Dispatcher.dispatch({
			type:SESSIONS_ACTIONS.DELETE_SESSION,
			id:id
		});
	}
	loadSession(id)
	{
		Dispatcher.dispatch({
			type:SESSIONS_ACTIONS.LOAD_SESSION,
			id:id
		});
	}
	loadFile(content)
	{
		Dispatcher.dispatch({
			type:SESSIONS_ACTIONS.LOAD_FILE,
			content:content
		})
	}
	updateSession(id)
	{
		Dispatcher.dispatch({
			type:SESSIONS_ACTIONS.UPDATE_SESSION,
			id:id
		});
	}
	saveSession(name)
	{
		Dispatcher.dispatch({
			type:SESSIONS_ACTIONS.SAVE_SESSION,
			sessionName:name
		});
	}
}

export const sessionsActions=new SessionsActions();
