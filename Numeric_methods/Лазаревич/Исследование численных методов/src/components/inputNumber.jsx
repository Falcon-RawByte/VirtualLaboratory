import React from "react";

class InputNumber extends React.Component
{
	constructor(props)
	{
		super(props);
		this.state={value:this.props.value};
		this._onChange=this._onChange.bind(this);
		this._onBlur=this._onBlur.bind(this);
	}
	_onChange(event)
	{
		this.setState({value:event.target.value});
	}
	static getDerivedStateFromProps(props, state)
	{
		return {value:props.value};
	}
	_onBlur(event)
	{
		let val=this.state.value;
		val=parseFloat(val);
		if(isNaN(val))
		{
			val=this.props.value;
		}else
		{
			if(this.props.min!=undefined&&!isNaN(this.props.min))
			{
				val=Math.max(this.props.min,val);
			}
			if(this.props.max!=undefined&&!isNaN(this.props.max))
			{
				val=Math.min(this.props.max,val);
			}
		}
		this.setState({value:val});
		this.props.onChange({target:{value:val,name:this.props.name,type:this.props.type}});
	}
	render(){
		let className="methodListItem";
		if(this.props.selected)
		{
			className+=" methodListItemSelected";
		}
		return (<div >
				<input className={this.props.className} type="number" onChange={this._onChange} onBlur={this._onBlur} value={this.state.value} min={this.props.min} max={this.props.max} step="any"/>
			</div>
			);
	}
}

module.exports=InputNumber;