import React from "react";
/*
const presets=[
{presetData:{methodName:,methodParameters:{step:,minStep:,...}}},
{presetData:{}},
{presetData:{}},
];*/

class langSwitcher extends React.Component
{
	constructor(props)
	{
		super(props);
	}
	render(){
		let options=[];
		this.props.langList.forEach(function(el,index)
			{
				options.push(<option value={index} key={"langOption_"+index}>{el}</option>);


			});
		return (
			<div id="langBlock">
			<select value={this.props.selectedLang} onChange={this.props.onLangChange}>
			</select>
			</div>
			);
	}
}

module.exports=SessionsList;







