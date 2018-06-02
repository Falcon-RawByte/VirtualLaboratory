import Dispatcher from "../dispatcher.js";



export const METHOD_PICKER_ACTIONS=
{
	ADD_METHOD: "ADD_METHOD",
	REMOVE_METHOD: "REMOVE_METHOD",
	UPDATE_METHOD: "UPDATE_METHOD",
	SELECT_METHOD: "SELECT_METHOD"
};

class MethodPickerActions{

	addMethod()
	{
		Dispatcher.dispatch(
		{
			type:METHOD_PICKER_ACTIONS.ADD_METHOD
		});
	}
	removeMethod(id)
	{
		Dispatcher.dispatch({
			type:METHOD_PICKER_ACTIONS.REMOVE_METHOD,
			id:id
		});
	}
	updateMethod(id,name,value)
	{
		Dispatcher.dispatch({
			type:METHOD_PICKER_ACTIONS.UPDATE_METHOD,
			id:id,
			name:name,
			value:value
		});
	}
	selectMethod(id)
	{
		Dispatcher.dispatch({
			type:METHOD_PICKER_ACTIONS.SELECT_METHOD,
			id:id
		});
	}
}

export const methodPickerActions=new MethodPickerActions();
