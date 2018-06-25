import React from "react";


class MethodPickerListItem extends React.Component
{
	constructor(props)
	{
		super(props);
		this._select=this._select.bind(this);
		this._remove=this._remove.bind(this);
	}
	_select(event)
	{
		event.preventDefault();
		event.stopPropagation();
		this.props.onSelect(this.props.number);
	}
	_remove(event)
	{
		event.preventDefault();
		event.stopPropagation();
		this.props.onRemove(this.props.number);
	}
	render(){
		let className="methodListItem";
		if(this.props.selected)
		{
			className+=" methodListItemSelected";
		}
		return (<div id="method1" className={className} onClick={this._select}>
				<div className="methodInfoContainer">
					<div className="methodNumber">{this.props.number+1}
					</div>
					<div className="methodName">{this.props.methodName}
					</div>
				</div>
				<div className="methodColor" style={this.props.color}>
				</div>
				<div className="methodRemoveButton" onClick={this._remove}>
					<img src="./css/open-iconic-master/svg/x.svg" className="methodRemoveIcon" alt="x" />
				</div>
			</div>
			);
	}
}

MethodPickerListItem.defaultProps = {
 methodName:"Undefined",
 number:0,
 style:
	 {
	 	backgroundColor:'black'
	 }
};

module.exports=MethodPickerListItem;