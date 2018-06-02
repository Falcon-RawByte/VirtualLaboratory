import React from "react";
import MethodPickerListItem from "./methodPickerListItem.jsx";
import MethodParameters from "./methodParameters.jsx";
import {colors,defaultParameters, methodPickerStore,Methods} from "../stores/methodPickerStore.js";
import {methodPickerActions} from "../actions/methodPickerActions.js";




class MethodPicker extends React.Component
{
	
	constructor(props)
	{
		super(props);
		this.getMethods=this.getMethods.bind(this);
		this._methodSelect=this._methodSelect.bind(this);
		this._methodRemove=this._methodRemove.bind(this);
		this._methodUpdate=this._methodUpdate.bind(this);
		this.state={selectedId:-1,methods:
			[
				/*{methodParameters:{methodId:0,methodNumber:0},colorId:0},
				{methodParameters:{methodId:1,methodNumber:1},colorId:1}*/
			]}
		    //colorPallete:["#E600CE","#0014AF","$00C13A","#F6D444"],//violet blue green yellow
			//methodList:["method one","method two"]};
	}
	getMethods()
	{
		this.setState({methods:methodPickerStore.getMethods(),selectedId:methodPickerStore.getSelectedMethod()});
	}
	componentWillMount()
	{
		methodPickerStore.on("change",this.getMethods);
	}
	componentWillUnmount()
	{
		methodPickerStore.removeListener("change",this.getMethods);
	}
	_updateMethodName(id,methodNameId)
	{
		methods[id].methodParameters.methodId=methodNameId;
	}
	_methodAdd()
	{
		methodPickerActions.addMethod();
	}
	_methodRemove(id)
	{
		/*if(id==this.state.selectedId)
			this.setState({selectedId:-1});
		else if(id<this.state.selectedId)
		{
			this.setState({selectedId:(this.state.selectedId-1)});
		}*/
		methodPickerActions.removeMethod(id);
	}
	_methodSelect(id)
	{
		//populate parameters
		//this.setState({selectedId:id});
		methodPickerActions.selectMethod(id);

			//getMethodParameters
		/*if(selectedId==-1)
		{
			//show parameters
		}*/
	}
	_methodUpdate(name,value)
	{
		methodPickerActions.updateMethod(this.state.selectedId,name,value);
	}
	render()
	{
		var self=this;
		var items=this.state.methods.map(function(data,index)
		{
			var color={backgroundColor:colors[index]};
			return <MethodPickerListItem key={index+"_pickerListItem"} onSelect={self._methodSelect} onRemove={self._methodRemove} methodName={Methods[data.parameters.selectedMethod].attributes.name} number={index} selected={(self.state.selectedId==index)} color={color}/>;
		});
		return (
			<div id="methodsBlock" >
			<div id="methodsBlockLabel" className="componentLabel">Выбор методов
			</div>
			<div id="methodsListBlock">
				<div id="methodsList">
					<button id="addButton" className="btn btn-primary" onClick={this._methodAdd} disabled={this.state.methods.length==4?true:false}>
					<img className="addButtonIcon" src="./css/open-iconic-master/svg/plus.svg" alt="Добавить"/>
					</button>
					{items}
				</div>
				<MethodParameters onUpdate={self._methodUpdate} parameters={this.state.selectedId==-1?defaultParameters:this.state.methods[this.state.selectedId].parameters} show={this.state.selectedId!=-1}/>
			</div>
			</div>
			);
	}
}

module.exports=MethodPicker;