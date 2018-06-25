import React from "react";
import $ from 'jquery';

var steps=[
{
	apply:function()
	{
		$('#sessionBlock').removeClass('showFocused');
		$('#taskBlockLabel')[0].scrollIntoView({
		  behavior:"smooth",
		  block:"start"
		});
		$('#taskBlockLabel').addClass('showFocused');
		$('#taskList').addClass('showFocused');
		//move to element
		//change element style

	},
	restore:function()
	{
		$('#taskDescriptionLabel').removeClass('showFocused');
		$('#taskDescription').removeClass('showFocused');
		$('#taskBlockLabel')[0].scrollIntoView({
		  behavior:"smooth",
		  block:"start"
		});
		$('#taskBlockLabel').addClass('showFocused');
		$('#taskList').addClass('showFocused');
		//rechangeelement style

	},
	description:(<div className="helpDescriptionContent">
		<div className="componentLabel helpDescriptionLabel">Choice of ODE system</div>
		<div>List of different ODE systems used for methods comparison is presented in this block.</div>
		</div>)
},
{
	apply:function()
	{

		$('#taskBlockLabel').removeClass('showFocused');
		$('#taskList').removeClass('showFocused');
		$('#taskDescriptionLabel')[0].scrollIntoView({
		  behavior:"smooth",
		  block:"start"
		});
		$('#taskDescriptionLabel').addClass('showFocused');
		$('#taskDescription').addClass('showFocused');
		//move to element
		//change element style

	},
	restore:function()
	{
		$('#taskParametersBlock').removeClass('showFocused');
		$('#taskDescriptionLabel')[0].scrollIntoView({
		  behavior:"smooth",
		  block:"start"
		});
		$('#taskDescriptionLabel').addClass('showFocused');
		$('#taskDescription').addClass('showFocused');
		//rechangeelement style

	},
	description:(<div className="helpDescriptionContent">
		<div className="componentLabel helpDescriptionLabel">System description</div>
		<div>To change height of this block drag lower right corner.</div>
		</div>)
},
{
	apply:function()
	{
		$('#taskDescriptionLabel').removeClass('showFocused');
		$('#taskDescription').removeClass('showFocused');
		$('#taskParameters')[0].scrollIntoView({
		  behavior:"smooth",
		  block:"start"
		});
		$('#taskParametersBlock').addClass('showFocused');
		//move to element
		//change element style

	},
	restore:function()
	{
		$('#taskParameters')[0].scrollIntoView({
		  behavior:"smooth",
		  block:"start"
		});
		//rechangeelement style

	},
	description:(<div className="helpDescriptionContent">
		<div className="componentLabel helpDescriptionLabel">System parameters</div>
		<div>Values of system constants can be set here.</div>
		</div>)
},
{
	apply:function()
	{
		$('#taskInitials')[0].scrollIntoView({
		  behavior:"smooth",
		  block:"start"
		});

		//move to element
		//change element style

	},
	restore:function()
	{
		$('#methodsBlockLabel').removeClass('showFocused');
		$('#methodsList').removeClass('showFocused');
		$('#taskInitials')[0].scrollIntoView({
		  behavior:"smooth",
		  block:"start"
		});
		$('#taskParametersBlock').addClass('showFocused');
		//rechangeelement style

	},
	description:(<div className="helpDescriptionContent">
		<div className="componentLabel helpDescriptionLabel">Initial conditions and and argument interval</div>
		<div>Elements in this block allow to set values for initial conditions.</div>
		<div>Elements "Start time" and "Time length" used to set value t<sub>0</sub> and length of time interval of solution.</div>
		</div>)
},
{
	apply:function()
	{
		$('#taskParametersBlock').removeClass('showFocused');
		$('#methodsBlockLabel')[0].scrollIntoView({
		  behavior:"smooth",
		  block:"start"
		});
		$('#methodsBlockLabel').addClass('showFocused');
		$('#methodsList').addClass('showFocused');
		//move to element
		//change element style

	},
	restore:function()
	{
		$('#methodParameters').removeClass('showFocused');
		$('#methodsBlockLabel')[0].scrollIntoView({
		  behavior:"smooth",
		  block:"start"
		});
		$('#methodsBlockLabel').addClass('showFocused');
		$('#methodsList').addClass('showFocused');
		//mov

		//rechangeelement style

	},
	description:(<div className="helpDescriptionContent">
		<div className="componentLabel helpDescriptionLabel">Choice of methods</div>
		<div>The button with plus sign is used to add method to the list of methods, used in computation.</div>
		<div>Parameters of selected method are shown in right part of the block.</div>
		</div>) 
},
{
	apply:function()
	{
		$('#methodsBlockLabel')[0].scrollIntoView({
		  behavior:"smooth",
		  block:"start"
		});
		$('#methodParameters').addClass('showFocused');
		//move to element
		//change element style

	},
	restore:function()
	{
		$('#methodsBlockLabel')[0].scrollIntoView({
		  behavior:"smooth",
		  block:"start"
		});
		//mov
		//rechangeelement style

	},
	description:(<div className="helpDescriptionContent">
		<div className="componentLabel helpDescriptionLabel">Parameters of method</div>
		<div>"Method" - sets method</div>
		<div>"Step" - sets minimal step for numerical solution in 1/1000 of a second</div>
		<div>"Max step" - sets maximal step for solution, used for methods with variable step</div>
		<div>"Error tolerance" - sets value of error tolerance, which is used for step caluclation in methods with variable step</div>
		</div>) 
},
{
	apply:function()
	{
		$('#methodsBlockLabel')[0].scrollIntoView({
		  behavior:"smooth",
		  block:"start"
		});
		//move to element
		//change element style

	},
	restore:function()
	{
		$('#outputParametersBlock').removeClass('showFocused');
		$('#methodsBlockLabel')[0].scrollIntoView({
		  behavior:"smooth",
		  block:"start"
		});
		$('#methodParameters').addClass('showFocused');
		$('#methodsList').addClass('showFocused');
		$('#methodsBlockLabel').addClass('showFocused');
		//mov
		//rechangeelement style

	},
	description:(<div className="helpDescriptionContent">
		<div className="componentLabel helpDescriptionLabel">Parameters of method</div>
		<div>"Method order" - order of method, used for multistep methods.</div>
		<div>"Jacobian matrix" - the way of computing for elements of jacobian matrix.</div>
		<div>"Use constant matrix" - if it's set, jacobian matrix for iterations will be computed only one time for each step of implicit numerical method.</div>
		</div>) 
},
{
	apply:function()
	{
		$('#methodsList').removeClass('showFocused');
		$('#methodParameters').removeClass('showFocused');
		$('#methodsBlockLabel').removeClass('showFocused');
		$('#outputFooter').css({height:'400px',width:'100%'});
		$('#outputParametersLabel')[0].scrollIntoView({
		  behavior:"smooth",
		  block:"start"
		});
		$('#outputParametersBlock').addClass('showFocused');

		//move to element
		//change element style

	},
	restore:function()
	{
		$('#outputCalculateButton').removeClass('showFocused');
		$('#outputParametersLabel')[0].scrollIntoView({
		  behavior:"smooth",
		  block:"start"
		});
		$('#outputParametersBlock').addClass('showFocused');
		//rechangeelement style

	},
	description:(<div className="helpDescriptionContent">
		<div className="componentLabel helpDescriptionLabel">Output parameters</div>
		<div>This block contains checkboxes for various plots and also allows to choose solution, which will be used for computation of errors.</div>
		<div>There are specific plots for each task.</div>
		<div>Block "Plotting interval" allows to set time interval of solution, which will be used for plotting.</div>
		</div>) 
},
{
	apply:function()
	{
		$('#outputParametersBlock').removeClass('showFocused');
		$('#outputCalculateButton')[0].scrollIntoView({
		  behavior:"smooth",
		  block:"start"
		});
		$('#outputCalculateButton').addClass('showFocused');
		//move to element
		//change element style

	},
	restore:function()
	{
		$('#sessionBlock').removeClass('showFocused');
		$('#outputFooter').css({height:'400px',width:'100%'});
		$('#outputCalculateButton')[0].scrollIntoView({
		  behavior:"smooth",
		  block:"start"
		});
		$('#outputCalculateButton').addClass('showFocused');
		//rechangeelement style

	},
	description:(<div className="helpDescriptionContent">
		<div className="componentLabel helpDescriptionLabel">Computation</div>
		<div>Button "Compute" starts up computation of solutions with choosen methods.</div>
		<div>Blocks "Results" and "Plots" will apear after succesful computation.</div>
		</div>) 
},
{
	apply:function()
	{
		$('#outputCalculateButton').removeClass('showFocused');
		$('#sessionBlockLabel')[0].scrollIntoView({
		  behavior:"smooth",
		  block:"start"
		});
		$('#sessionBlock').addClass('showFocused');
		setTimeout(() => {
			$('#outputFooter').css({height:'0px',width:'0px'});
        	}, 400);
		//move to element
		//change element style

	},
	restore:function()
	{
		$('#sessionBlockLabel')[0].scrollIntoView({
		  behavior:"smooth",
		  block:"start"
		});
		//rechangeelement style

	},
	description:(<div className="helpDescriptionContent">
		<div className="componentLabel helpDescriptionLabel">Parameter's presets</div>
		<div>Presets contain values defined by user for particular system and are available until the user has closed the tab in browser.</div>
		<div>Presets can be saved or loaded from local hard drive as a file.</div>
		</div>)
},
{
	apply:function()
	{
		$('#sessionBlockLabel')[0].scrollIntoView({
		  behavior:"smooth",
		  block:"start"
		});
		//move to element
		//change element style

	},
	restore:function()
	{
		$('#sessionBlockLabel')[0].scrollIntoView({
		  behavior:"smooth",
		  block:"start"
		});
		//rechangeelement style

	},
	description:(<div className="helpDescriptionContent">
		<div className="componentLabel helpDescriptionLabel">Parameter's presets</div>
		<div>Possible actions:</div>
		<ul>
			<li>Add preset – adds new preset with current values of parameters</li>
			<li>Reset parameters – sets all parameters for choose system to default values</li>
			<li>Load from file – load presets from choosen file</li>
			<li>Save to file – saves all created presets on hard drive</li>
			<li>Load – apply saved parameters</li>
			<li>Delete – delete choosen preset</li>
		</ul>
		</div>)
}
];


class Help extends React.Component
{
	constructor(props)
	{
		super(props);
		this.state={step:0};
		this._moveForward=this._moveForward.bind(this);
		this._moveBackward=this._moveBackward.bind(this);
		this.maxStep=steps.length;
		
	}
	_moveForward()
	{
		let prevStep=this.state.step;
		let step=(this.state.step+1)%(this.maxStep+1);
		if(step>0)
			steps[step-1].apply();
		this.setState({step:step});
	}
	_moveBackward()
	{
		let step=(this.state.step-1);
		steps[step-1].restore();
		this.setState({step:step});
	}
	render(){
		let className='m-fadeIn';
		if(this.state.step==0)
		{
			className='m-fadeOut';
		}
		let description;
		if(this.state.step!=0)
		{
			description=(<div id="helpDescription">
							{steps[this.state.step-1].description}
							</div>);
		}
		let rightMark=this.state.step==this.maxStep?(<svg className="helpChangeIcon" xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8">
						  <use href="#check"></use>
						  </svg>):(<svg className="helpChangeIcon" xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8">
						  <use href="#arrow-right"></use>
						  </svg>);
		return (<div id="help">
					<div id="helpIcon" onClick={this._moveForward} className={this.state.step==0?'m-fadeIn':'m-fadeOut'}>
						<svg id="svgHelpIcon" xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8">
						  <use href="#question-mark"></use>
						  </svg>
					</div>
					<div id="helpBlock" className={className}>
						<div id="helpBackground">
						</div>
						<div className={'hideable'+(this.state.step!=0?' showModal':'')} id="helpContent">
							<div id="helpContentBackground">
							</div>
							<div id="helpPrevios" onClick={this._moveBackward} style={this.state.step==1?{visibility:'hidden'}:{}}>
							<svg className="helpChangeIcon" xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8">
							  <use href="#arrow-left"></use>
							  </svg>
							</div>
							{description}
							<div id="helpNext" onClick={this._moveForward}>
							{rightMark}
							</div>
						</div>
					</div>
				</div>
			);
	}
}

module.exports=Help;