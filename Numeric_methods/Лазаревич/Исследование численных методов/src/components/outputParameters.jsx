import React from "react";
import Slider, { Rail, Handles, Tracks, Ticks } from 'react-compound-slider';
import {colors, methodPickerStore} from "../stores/methodPickerStore.js";
import {outputParametersStore} from "../stores/outputParametersStore.js";
import {outputParametersActions} from "../actions/outputParametersActions.js";
import {taskParametersStore} from "../stores/taskParametersStore";
import {Handle, Track, Tick} from './SliderComponents.jsx';

const sliderStyle = {
  position: 'relative',
  width: '100%',
}

const railStyle = {
  position: 'absolute',
  width: '100%',
  height: 14,
  borderRadius: 7,
  cursor: 'pointer',
  backgroundColor: 'rgb(155,155,155)',
}


class OutputParameters extends React.Component
{
	constructor(props)
	{
		super(props);
		this.getMethods=this.getMethods.bind(this);
		this.getParameters=this.getParameters.bind(this);
		this.state={parameters:outputParametersStore.getParameters(),methods:methodPickerStore.getMethodListNames()};
	}
	componentWillMount()
	{
		methodPickerStore.on("change",this.getMethods);
		outputParametersStore.on("change",this.getParameters);

	}
	componentWillUnmount()
	{
		methodPickerStore.removeListener("change",this.getMethods);
		outputParametersStore.removeListener("change",this.getParameters);
	}
	getParameters()
	{
		this.setState({parameters:outputParametersStore.getParameters()});
	}
	getMethods()
	{
		this.setState({methods:methodPickerStore.getMethodListNames()});
	}
	componentDidMount()
	{
	}
	_updateParameter(e)
	{
		outputParametersActions.updateParameter(e.target.name,(e.target.type === 'checkbox' ? e.target.checked : e.target.value));
	}
	_updatePlots(e)
	{
		outputParametersActions.updatePlots(e.target.name,e.target.checked);
	}
	_updateSlider(e)
	{
		outputParametersActions.updateParameter('plotInterval',e);
	}
	render(){
		let methodList=[];
		this.state.methods.forEach(function(data,index)
		{
			methodList.push(<option key={index+"errorMethodList"} value={index}>{"Использовать решение "+(index+1) +'. '+ data}</option>);
		});
		let checkboxes=[];
		let self=this;
		this.state.parameters.plots.forEach(function(data,index)
		{
			checkboxes.push(<div className="table_row" key={index+"_plotDiv"}>
				<label key={index+"_plotLabel"} className="table_label" htmlFor={index+"_input"}>{data.name}</label>
				<input  className="table_input" type="checkbox" name={index} key={index+"_input"} id={index+"_input"} onChange={self._updatePlots} checked={data.value} />
					</div>);
		});
		let domain=[this.state.parameters.plotDomain.t0, this.state.parameters.plotDomain.t1], reversed=false;
		let values=this.state.parameters.plotInterval;
		let ticks=20;
		let step=(domain[1]-domain[0])/ticks;
		return (
			<div id="outputParametersBlock">
			<div id="outputParametersLabel" className="componentLabel">Параметры выходных данных</div>
			<div id="outputParametersContent">
				<div style={{display:'table',borderSpacing:'5px'}}>
					<div className="table_row">		
					<label className="table_label">Расчёт ошибки</label>
				 	<select id="outputMainMethod" name="errorMethod" style={{width:"300px"}} onChange={this._updateParameter} value={this.state.parameters.errorMethod}>
				 		<option value="-1">Не производить</option>
				 		{methodList}
				 	</select>
					</div>
					<div className="table_row">						
						<label className="table_label" htmlFor="errors_input">Графики локальной и глобальной ошибок</label>
						<input  className="table_input" type="checkbox" name="errorPlot" id="errors_input" onChange={self._updateParameter} checked={this.state.parameters.errorPlot} />

					</div>
					<div className="table_row">
						<label className="table_label" htmlFor="eigenvalue_input">График максимальных по модулю собственных чисел</label>
						<input  className="table_input" type="checkbox" name="eigenvaluePlot" id="eigenvalue_input" onChange={self._updateParameter} checked={this.state.parameters.eigenvaluePlot} />
					</div>
					{checkboxes}
			 	</div>
			 	</div>
			 	<div>
			 		<div className="componentLabel" id="outputPlotIntervalLabel">
			 		Интервал построения графика
			 		</div>
				 	<div id="plotSlider" style={{padding:"20px "+50/ticks+"%",marginBottom:"20px"}}>
					 	<Slider
				          mode={1}
				          step={step}
				          domain={domain}
				          reversed={reversed}
				          rootStyle={sliderStyle}
				          onChange={this._updateSlider}
				          values={values}
				        >
				        	<Rail>
					            {({ getRailProps }) => (
					              <div style={railStyle} {...getRailProps()} />
					            )}
				          	</Rail>
					        <Handles>
					            {({ handles, getHandleProps }) => (
					              	<div className="slider-handles">
						                {
						                	handles.map(handle => (
						                  <Handle
						                    key={handle.id}
						                    handle={handle}
						                    domain={domain}
						                    getHandleProps={getHandleProps}
						                  />
						                	))
						            	}
					              	</div>
					            )}
					        </Handles>
					        <Tracks left={false} right={false}>
					            {({ tracks, getTrackProps }) => (
					              <div className="slider-tracks">
					                {tracks.map(({ id, source, target }) => (
					                  <Track
					                    key={id}
					                    source={source}
					                    target={target}
					                    getTrackProps={getTrackProps}
					                  />
					                ))}
					              </div>
					            )}
					        </Tracks>
					        <Ticks count={ticks}>
					            {({ ticks }) => (
					              <div className="slider-ticks">
					                {ticks.map(tick => (
					                  <Tick key={tick.id} tick={tick} count={ticks.length} />
					                ))}
					              </div>
					            )}
					        </Ticks>
				        </Slider>
				 	</div>
				 </div>
			</div>
			);
	}
}

module.exports=OutputParameters;



