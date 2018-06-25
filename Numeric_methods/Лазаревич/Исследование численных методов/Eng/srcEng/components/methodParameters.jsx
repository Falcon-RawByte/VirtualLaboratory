import React from "react";
import {Methods,dependOnMethod} from "../stores/methodPickerStore.js";
import InputNumber from "./InputNumber.jsx";
//import from methods


class MethodParameters extends React.Component
{
	constructor(props)
	{
		super(props);
		/*let options=Object.assign({},dependOnMethod);
		let selectedMethod=this.props.parameters.selectedMethod;
		let m=Methods[selectedMethod];
		if(m.options!==undefined)
		{	
			m.options.forEach(function(data)
				{
					options[data]=true;
				});
			if(m.minOrder!==undefined&&m.maxOrder!==undefined)
			{
				options.minOrder=m.minOrder;
				options.maxOrder=m.maxOrder;
			}
		}*/
		/*this.state={dependOnMethod:options,selectedMethod:selectedMethod};*/
		this._methodChange=this._methodChange.bind(this);
		this._inputChange=this._inputChange.bind(this);
		this.methodList=[];
		let self=this;
		Methods.forEach(
		function(data,index){
			self.methodList.push(<option key={index+"methodList"} value={index}>{data.attributes.name}</option>);
		});
	}
	_methodChange(e)
	{
		this._inputChange(e);
	}
	_inputChange(e)
	{
		this.props.onUpdate(e.target.name,(e.target.type === 'checkbox' ? e.target.checked : e.target.value));
	}
	render()
	{
		let options=Object.assign({},dependOnMethod);
		let selectedMethod=this.props.parameters.selectedMethod;
		let m=Methods[selectedMethod];
		if(m.options!==undefined)
		{	
			m.options.forEach(function(data)
				{
					options[data]=true;
				});
			if(m.minOrder!==undefined&&m.maxOrder!==undefined)
			{
				options.minOrder=m.minOrder;
				options.maxOrder=m.maxOrder;
			}
		}

		var style={visibility:'hidden'};
		if(this.props.show)
			style={visibility:'visible'};
		let methodRows=[];
		/*Methods.forEach(function(data,i)
		{
			methodRows.push(<option key={i} value={i}>{data}</option>);
		})*/
		let orderRows=[];
		for(let i=options.minOrder;i<=options.maxOrder;i++) 
		{
			orderRows.push(<option key={i+"optionsOrder"} value={i}>{i}</option>);
		}
		return (
			<div id="methodParameters" style={style}>
				<div id="methodAddingTable" >
					<div className="table_row">
						<label className="table_label">Method</label>
						<select className="table_input method_select" name="selectedMethod" onChange={this._methodChange} value={this.props.parameters.selectedMethod}/*React specific*/>
						{/*{methodRows}*/}
						{this.methodList}
						</select>
					</div>
					<div className="table_row">
						<label className="table_label">Step, 1E-3</label>
						<InputNumber className="table_input step" type="number" name="stepValue" onChange={this._inputChange} value={this.props.parameters.stepValue} step="any" min={this.props.taskDependent.stepMin} max={this.props.taskDependent.stepMax}/>
					</div>
					<div className="table_row_group autoStep" style={(!options.autoStepEnabled)?{display:'none'}:{}}>
						<div className="table_row">
							<label className="table_label">Max step, 1E-3</label>
							<InputNumber className="table_input maxStep" type="number" name="maxstepValue" onChange={this._inputChange} value={this.props.parameters.maxstepValue} step="any" min={this.props.taskDependent.stepMin} max={this.props.taskDependent.stepMax}/>
						</div>
						<div className="table_row">
							<label className="table_label">Error tolerance</label>
							<InputNumber className="table_input errorTolerance" name="errorValue" onChange={this._inputChange} type="number" value={this.props.parameters.errorValue} step="any" min="0" max='NaN'/>
						</div>
					</div>
					<div className="table_row_group chooseOrder" style={(!options.chooseOrderEnabled)?{display:'none'}:{}}>
						<div className="table_row">
							<label className="table_label">Method order</label>
							<select className="table_input Orders" name="selectedOrder" onChange={this._inputChange} value={this.props.parameters.selectedOrder}>
									{orderRows}
							</select>
						</div>
					</div>
					<div className="table_row_group useJacobian" style={(!options.jacobianMatrixEnabled)?{display:'none'}:{}}>
						<div className="table_row jacobiMatrixEval">
							<label className="table_label">Jacobian matrix</label>
							<select className="table_input jacobianCalc" name="jacobianSelected" onChange={this._inputChange} value={this.props.taskDependent.jacobianAnalythicEnabled?this.props.parameters.jacobianSelected:1}>
								<option value='0' disabled={!this.props.taskDependent.jacobianAnalythicEnabled} >
									Analytical
								</option>
								<option value='1'>
									Numerical
								</option>
							</select>
						</div>
						<div className="table_row">
							<label className="table_label">Use constant matrix</label>
							<input type="checkbox" className="table_input jacobianConst" name="useConstMatrix" onChange={this._inputChange} checked={this.props.parameters.useConstMatrix}/>
						</div>
					</div>
				</div>
			</div>
			);
	}
}
MethodParameters.defaultProps = {
  show:false,
  minOrder:1,
  maxOrder:5,
  methodNames:['one','two']
};

module.exports=MethodParameters;