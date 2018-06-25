import React from "react";
import Plot from 'react-plotly.js';
import serialSolver from "../serialSolver.js";
import {sessionsStore} from "../stores/sessionsStore.js";
import {colors, methodPickerStore} from "../stores/methodPickerStore.js";
import {taskParametersStore} from "../stores/taskParametersStore.js";
import {outputParametersStore} from "../stores/outputParametersStore.js";
import {Methods} from "../methods.js";

class Output extends React.Component
{
	constructor(props)
	{
		super(props);
		this._calculate=this._calculate.bind(this);
		this._setProgress=this._setProgress.bind(this);
		this.state={data:undefined,progress:0,frameId:-1,task:undefined};
	}
	_calculate()
	{

		let methods=methodPickerStore.getMethods();
		if(methods.length==0)
			return;
		let outputParameters=outputParametersStore.getParameters();
		let taskParameters=taskParametersStore.getSelectedTaskParameters();
		let task=taskParametersStore.getSelectedTask();
		let data=serialSolver.solve(methods,taskParameters,outputParameters,this._setProgress,task);
		/*
		data:
		{
			statistics:
			error,
			methodName,
			color
			plots:
			errorPlot:
			eigenvaluePlot:
		}
		*/
		/*
			serialSolver.init();
			frameID=window.requestAnimationFrame( serialSolver.loop );
			_stop()
			{
				 window.cancelAnimationFrame( this.state.frameId );
			}
			_getData(data)//callback
			{
				if(data.success)
				{
					this.setState({data:data,progress:100,frameId:-1});
				}
			}
		*/

		this.setState({data:data,progress:100,frameId:-1,task:task});
	}
	componentDidUpdate()
	{
		if(this.state.data!==undefined)
		{
			setTimeout(() => {
            this.resultNode.scrollIntoView(true);
        	}, 0);
		}
	}
	calcBatchInterval(methods,task)
	{
		let t=0;
		let mem=8*1024*1024/(8*(task.variables.length+1));
		for(var i=0;i<methods.length;i++)
		{
			t+=1.0/methods[i].parameters.stepValue;
		}
		return mem/t;
	}
	_setProgress(progress)
	{
		this.setState({progress:progress});
	}
	render(){
		let statistics=[];
		let plots=[];
		if(this.state.data!==undefined)
		{
			self=this;
			let stat=this.state.data.statistics;
			let methods=this.state.data.methods;
			let output=this.state.data;
			output.statistics.forEach(function(el,index)
			{
				statistics.push(<div key={index+"_stat"} style={{color:colors[output.methods[index].color]}}>{(index+1)+". "+Methods[output.methods[index].name].attributes.name}</div>);
				if(el.localError!=undefined)
				{	
					statistics.push(<div key={index+"_stat_avlocerr"} style={{marginLeft:'40px'}}>{"Average local error: "+el.localError.toPrecision(3)}</div>);
					statistics.push(<div key={index+"_stat_avgloberr"} style={{marginLeft:'40px'}}>{"Average global error: "+el.globalError.toPrecision(3)}</div>);
					statistics.push(<div key={index+"_stat_maxlocerr"} style={{marginLeft:'40px'}}>{"Maximum local error: "+el.maxLocalError.toPrecision(3)}</div>);
					statistics.push(<div key={index+"_stat_maxgloberr"} style={{marginLeft:'40px'}}>{"Maximum global error: "+el.maxGlobalError.toPrecision(3)}</div>);
					statistics.push(<div key={index+"_stat_finalgloberr"} style={{marginLeft:'40px'}}>{"Final global error: "+el.finalGlobalError.toPrecision(3)}</div>);
				}
				statistics.push(<div key={index+"_stat_calc"} style={{marginLeft:'40px'}}>{"Right side elements evaluation count: "+el.calculations}</div>);
				statistics.push(<div key={index+"_stat_step"} style={{marginLeft:'40px'}}>{"Average step E-3: "+(el.averageStep*1000).toPrecision(3)}</div>);
				statistics.push(<div key={index+"_stat_jacobi"} style={{marginLeft:'40px'}}>{"Jacobian matrix elements evaluation count: "+el.jacobianCalculations}</div>);
				statistics.push(<div key={index+"_stat_matrix"} style={{marginLeft:'40px'}}>{"Linear system solved: "+el.matrixSolving}</div>);
			});
			if(output.localErrorPlots.length>0)
			{
				let localTraces=[];
				let globalTraces=[];
				output.localErrorPlots.forEach(function(el,index)
					{
						localTraces.push({x:output.timeArrays[output.errorIndicies[index]],
							y:el,
							line:{color:colors[output.methods[index].color]},
							marker:{color:colors[output.methods[index].color]},
							name:(output.errorIndicies[index]+1)+". "+Methods[output.methods[output.errorIndicies[index]].name].attributes.name,
 							mode: 'lines+markers'
						});
						globalTraces.push({x:output.timeArrays[output.errorIndicies[index]],
							y:output.globalErrorPlots[index],
							line:{color:colors[output.methods[index].color]},
							marker:{color:colors[output.methods[index].color]},
							name:(output.errorIndicies[index]+1)+". "+Methods[output.methods[output.errorIndicies[index]].name].attributes.name,
 							mode: 'lines+markers'
						});
					});
				plots.push(<div style={{width:'100%'}} key="localErrorPlot"><Plot useResizeHandler={true} style={{width:'100%'}} key="localErrorPlot" data={localTraces} 
					layout={
						{
							showlegend:true,
							title:'Local error plot',
							xaxis:{title:this.state.task.argument.plotDescription},
							yaxis:{title:'Local error'},
							legend:{   
									xanchor: "left",
								    yanchor:'bottom',
								    y:-0.5,
								    x:0
							   },
							autosize:true
						}
					}/></div>);
				plots.push(<div key="globalErrorPlot"><Plot useResizeHandler={true} style={{width:'100%'}} key="globalErrorPlot" data={globalTraces} 
					layout={
						{
							showlegend:true,
							title:'Global error plot',
							xaxis:{title:this.state.task.argument.plotDescription},
							yaxis:{title:'Global error'},
							legend:{   
									xanchor: "left",
								    yanchor:'bottom',
								    y:-0.5,
								    x:0
							   },
							autosize:true
						}
					}/></div>);
			}
			if(output.eigenvaluePlots.length>0)
			{
				let traces=[];
				output.eigenvaluePlots.forEach(function(el,index)
					{
						traces.push({x:output.timeArrays[index],
							y:el,
							line:{color:colors[output.methods[index].color]},
							marker:{color:colors[output.methods[index].color]},
							name:(index+1)+". "+Methods[output.methods[index].name].attributes.name,
 							mode: 'lines+markers'
						});
					});
				plots.push(<div key="diveigenvaluePlot"><Plot useResizeHandler={true} style={{width:'100%'}} key="eigenvaluePlot"
						data={traces}
						layout={
							{
								showlegend:true,
								title:'Maximum module of real parts of eigenvalues',
								xaxis:{title:this.state.task.argument.name},
								yaxis:{title:'|Re(\u033b)|'},
							legend:{   
									xanchor: "left",
								    yanchor:'bottom',
								    y:-0.5,
								    x:0
							   },
							autosize:true
							}
						}
					/></div>);
			}
			if(output.plots.length>0)
			{
				output.plots.forEach(function(el,index)
				{
					let traces=[];
					el.plotData.forEach(function(elem,ind)
					{
						let data={};
						data.x=elem.x;
						data.y=elem.y;
						if(elem.z!==undefined)
						{	
							data.z=elem.z;
							data.type='scatter3d';
						}
						data.name=(ind+1)+". "+Methods[output.methods[ind].name].attributes.name;
						data.mode= 'lines+markers';
						data.line={color:colors[output.methods[ind].color]};
						data.marker={color:colors[output.methods[ind].color]};
						traces.push(data);
					});
					let layout={
							showlegend:true,
							title:self.state.task.plotInfo[el.index].description,
							xaxis:{title:self.state.task.plotInfo[el.index].x.description},
							yaxis:{title:self.state.task.plotInfo[el.index].y.description},
							legend:{   
									xanchor: "left",
								    yanchor:'bottom',
								    y:-0.5,
								    x:0
							   },
							autosize:true
						};
						let z=self.state.task.plotInfo[el.index].z;
						if(z!==undefined)
							layout.zaxis={title:z.description};
					plots.push(<div  key={index+"div_plot"}><Plot useResizeHandler={true} style={{width:'100%'}} key={index+"_plot"}
						data={traces}
						layout={layout}
						/></div>);
				});
			}
		}
		return (
			<div id="outputBlock">
			<progress id="progressBar" style={{width:'100%'}} value={this.state.progress} max="100"></progress>
			<div style={{textAlign:'center'}}>
			<button id="outputCalculateButton" className="btn btn-primary startButton" onClick={this._calculate}>Compute</button>
			</div>
			<div id="output" ref={node => this.resultNode = node} style={this.state.data==undefined?{display:'none'}:{}}>
				<div id="outputResultsLabel" className="componentLabel">Results</div>
				<div id="ouputInnerBlock">
					{statistics}
				</div>
				<div id='outputGraphLabel' className="componentLabel" style={plots.length>0?{}:{display:'none'}}>
				Plots
				</div>
				<div id="ouputInnerPlotBlock" style={plots.length>0?{}:{display:'none'}} >
					{plots}
				</div>
			</div>
			<div id="outputFooter">
			</div>
			</div>
			);
	}
}

module.exports=Output;