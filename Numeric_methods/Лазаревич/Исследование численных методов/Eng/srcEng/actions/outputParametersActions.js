import Dispatcher from "../dispatcher.js";



export const OUTPUT_PARAMETERS_ACTIONS=
{
	UPDATE_PARAMETER:"UPDATE_PARAMETER",
	UPDATE_PLOTS:"UPDATE_PLOTS"
};

class OutputParametersActions{
	updateParameter(name,value)
	{
		Dispatcher.dispatch({
			type:OUTPUT_PARAMETERS_ACTIONS.UPDATE_PARAMETER,
			name:name,
			value:value
		});
	}
	updatePlots(name,value)
	{
		Dispatcher.dispatch({
			type:OUTPUT_PARAMETERS_ACTIONS.UPDATE_PLOTS,
			name:name,
			value:value
		});
	}
}

export const outputParametersActions=new OutputParametersActions();
