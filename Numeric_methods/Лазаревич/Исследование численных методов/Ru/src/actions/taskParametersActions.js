import Dispatcher from "../dispatcher.js";



export const TASK_ACTIONS=
{
	SELECT_TASK:"SELECT_TASK",
	UPDATE_PARAMETER:"UPDATE_PARAMETER",
	UPDATE_VARIABLE:"UPDATE_VARIABLE",
	UPDATE_ARGUMENT:"UPDATE_ARGUMENT"
};

class TaskParametersActions{
	selectTask(id)
	{
		Dispatcher.dispatch(
		{
			type:TASK_ACTIONS.SELECT_TASK,
			id:id
		});
	}
	updateParameter(name,value)
	{
		Dispatcher.dispatch({
			type:TASK_ACTIONS.UPDATE_PARAMETER,
			name:name,
			value:value
		});
	}
	updateVariable(name,value)
	{
		Dispatcher.dispatch({
			type:TASK_ACTIONS.UPDATE_VARIABLE,
			name:name,
			value:value
		});
	}
	updateArgument(name,value)
	{
		Dispatcher.dispatch({
			type:TASK_ACTIONS.UPDATE_ARGUMENT,
			name:name,
			value:value
		});
	}

}

export const taskParametersActions=new TaskParametersActions();