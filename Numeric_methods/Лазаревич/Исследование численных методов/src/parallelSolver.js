import {Methods} from './methods.js';
import $ from 'jquery';
import QRAlgorithm from "./QRAlgorithm.js";

class ParallelSolverSolver
{
	constructor()
	{
	}
	calcEigenvaluePlot(xvt,jacobian,useJacobian)
	{
		var rank=xvt.xv.length;
		var matrix=new Array(rank*rank);
		var jacobianStep=0.001;
		var vector=xvt.xv.slice();
		for(var j=0;j<rank;j++)
		{
			for(var k=0;k<rank;k++)
			{
				if(useJacobian==true)
					matrix[j*rank+k]=jacobian[j*rank+k](vector,xvt.t);
				else
				{
					var y_temp=vector[k];
					var df=(jacobian[j](vector,xvt.t));
					vector[k]+=jacobianStep;
					df=jacobian[j](vector,xvt.t)-df;
					df/=jacobianStep;
					matrix[k+j*rank]=df;
					vector[k]=y_temp;
				}
			}
		}
		var eigenvalues=QRAlgorithm(matrix,rank,40);
		var max=0.0;
		for(var j=0;j<rank;j++)
		{
			var current=Math.abs(eigenvalues.values[j]);
			if(current>max)
				max=current;
		}
		return max;
	}
	calcPlots(xvt,plotArray)
	{
		plotArray.forEach(function(el)
		{
			let index=el.index;
			let value=0;
			if(index<xvt.xv.length)
			{
				value=xvt.xv[index];
				el.data.push(value);
			}			
		});
	}
	worker(data)
	{

		options;
		variables;
		method;
		t0;
		t1;
		t0Plot;
		t1Plot;
		mainMethod;
		calcMain;
		plotCondition;
		errorPlot;
		eigenvaluePlot;
		index;
		workerSolve(options,variables,method,t0,t1,t0Plot,t1Plot,mainMethod,calcMain,plotCondition,errorPlot,eigenvaluePlot,index);
	}
	workerSolve(options,variables,method,t0,t1,t0Plot,t1Plot,mainMethod,calcMain,plotCondition,errorPlot,eigenvaluePlot,index)
	{
		let output=
		{
			statistics:null,
			plots:[],
			localErrorPlotData:null,
			globalErrorPlotData:null,
			eigenvaluePlotData:null,
			timeArray:null,
			errorIndex:null
		}
			var errorPlotData=new Array(3);
			errorPlotData[0]=new Array();//time
			errorPlotData[1]=new Array();//local
			errorPlotData[2]=new Array();//global
			var eigenvalueData=new Array();
			plotArray.forEach(function(el)
			{
				el.data=new Array();
			});
			plotArray[plotArray.length-1].data=errorPlotData[0];

			let solver=new Methods[method]();
			solver.Init(options);
			for(var j=0;j<count-1;j++)
			{
				lastDifference[j]=0;
			}
			let complexity={rightSideEvaluation:0,currentStep:0,averageStep:0,stepCount:0,matrixSolving:0};
			let localError=undefined;
			let globalError=undefined;
			let maxLocalError=undefined;
			let maxGlobalError=undefined;
			var finalGlobalError=undefined;
			let xvt={xv:variables.slice(),t:t0};
			if(!calcMain)
			{
				var condition=xvt.t<=tLast;
				while(condition)
				{
					if(xvt.t>tLast)
					{
						condition=false;
					}
					if(plotCondition&&xvt.t<=t1Plot&&(xvt.t>=t0Plot))
					{
						errorPlotData[0].push(xvt.t);
						if(eigenvaluePlot)
						{
							eigenvalueData.push(this.calcEigenvaluePlot(xvt,jacobian2,useJacobian));
						}
						if(plots.length>0)
						{
							this.calcPlots(xvt,plotArray);
						}
					}
					solver.Step(xvt,complexity);
					complexity.stepCount++;
					if(plotCondition&&xvt.t<=t1Plot&&(xvt.t>=t0Plot))
					{
						errorPlotData[0].push(xvt.t);
						if(eigenvaluePlot)
						{
							eigenvalueData.push(this.calcEigenvaluePlot(xvt,jacobian2,useJacobian));
						}
						if(plots.length>0)
						{
							this.calcPlots(xvt,plotArray);
						}
					}
				}
			}else
			{
				localError=0;
				globalError=0;
				maxLocalError=0;
				maxGlobalError=0;
				finalGlobalError=0;
				let mainComplexity={rightSideEvaluation:0,currentStep:0,averageStep:0,stepCount:0};
				let xvtMain={xv:variables.slice(),t:t0};
				let xvt={xv:variables.slice(),t:t0};
				let lastxvt={xv:xvtMain.xv.slice(),t:xvtMain.t};
				let mainSolver=new Methods[mainMethod]();
				//Object.assign({},Methods[methods[Main].parameters.selectedMethod]);
				mainSolver.Init(options);
				let condition=(xvt.t<=tLast);
				while(condition)
				{
					if(xvt.t>=tLast&&xvtMain.t>=tLast&&xvtMain.t>=xvt.t)
						{
							condition=false;
						}
					let t;
					if(xvt.t==xvtMain.t)
					{
						t = xvt.t;
						let globalErrorValue=0;
						let localErrorValue=0;
						for(var j=0;j<count-1;j++)
						{
							//y~=y1-x1+dy/dx*x~
							let difference=xvtMain.xv[j] - xvt.xv[j];
							localErrorValue+= Math.pow(difference-lastDifference[j],2);
							lastDifference[j]=difference;
							globalErrorValue += Math.pow(difference,2);
						}
						globalErrorValue=Math.sqrt(globalErrorValue);
						localErrorValue=Math.sqrt(localErrorValue);
						maxGlobalError=Math.max(globalErrorValue,maxGlobalError);
						maxLocalError=Math.max(localErrorValue,maxLocalError);
						localError+=localErrorValue;
						globalError+=globalErrorValue;
						finalGlobalError=globalErrorValue;
						if(plotCondition&&xvt.t<=t1Plot&&(xvt.t>=t0Plot))
						{
							errorPlotData[0].push(t);
							if(errorPlot)
							{
								errorPlotData[1].push(localErrorValue);//local
								errorPlotData[2].push(globalErrorValue);//global
							}
							if(eigenvaluePlot)
							{
								eigenvalueData.push(this.calcEigenvaluePlot(xvt,jacobian2,useJacobian));
							}
							if(plots.length>0)
							{
								this.calcPlots(xvt,plotArray);
							}
						}
						solver.Step(xvt,complexity);
						complexity.stepCount++;
						lastxvt={xv:xvtMain.xv.slice(),t:xvtMain.t};
						mainSolver.Step(xvtMain,mainComplexity);
					}else if(xvt.t<xvtMain.t)
					{

						var x1 = lastxvt.t;
						var x2 = xvtMain.t;

						let globalErrorValue=0;
						let localErrorValue=0;
						t = xvt.t;
						for(var j=0;j<count-1;j++)
						{
							var y1 = lastxvt.xv[j];
							var y2 = xvtMain.xv[j];

							//y~=y1-x1+dy/dx*x~
							var y_s = y1 + (y2 - y1) / (x2 - x1) * (t - x1);
							let difference=y_s-xvt.xv[j];
							localErrorValue+= Math.pow(difference-lastDifference[j],2);
							lastDifference[j]=difference;
							globalErrorValue += Math.pow(difference,2);
						}
						globalErrorValue=Math.sqrt(globalErrorValue);
						localErrorValue=Math.sqrt(localErrorValue);


						maxGlobalError=Math.max(globalErrorValue,maxGlobalError);
						maxLocalError=Math.max(localErrorValue,maxLocalError);
						localError+=localErrorValue;
						globalError+=globalErrorValue;
						finalGlobalError=globalErrorValue;
						if(plotCondition&&xvt.t<=t1Plot&&(xvt.t>=t0Plot))
						{
							errorPlotData[0].push(t);
							if(errorPlot)
							{
								errorPlotData[1].push(localErrorValue);//local
								errorPlotData[2].push(globalErrorValue);//global
							}
							if(eigenvaluePlot)
							{
								eigenvalueData.push(this.calcEigenvaluePlot(xvt,jacobian2,useJacobian));
							}
							if(plots.length>0)
							{
								this.calcPlots(xvt,plotArray);
							}
						}
						
						solver.Step(xvt,complexity);
						complexity.stepCount++;
					}else
					{
						lastxvt={xv:xvtMain.xv.slice(),t:xvtMain.t};
						mainSolver.Step(xvtMain,mainComplexity);
						continue;
					}
				}
				localError/=Math.max(1,complexity.stepCount);
				globalError/=Math.max(1,complexity.stepCount);
			}
			//copy results
			complexity.averageStep/=Math.max(1,complexity.stepCount);
			output.statistics={
				localError:localError,
				globalError:globalError,
				maxLocalError:maxLocalError,
				maxGlobalError:maxGlobalError,
				finalGlobalError:finalGlobalError,
				calculations:complexity.rightSideEvaluation,
				averageStep:complexity.averageStep};

			if(plotCondition)
			{
				plots.forEach(function(el,index)
				{
					let plotObject={};
					plotObject.x=plotArray[plotIndicies[task.plotInfo[el.index].x.index]].data;
					plotObject.y=plotArray[plotIndicies[task.plotInfo[el.index].y.index]].data;
					if(task.plotInfo[el.index].z!==undefined)
						plotObject.z=plotArray[plotIndicies[task.plotInfo[el.index].z.index]].data;
					el.plotData.push(plotObject);
				});
				output.timeArray=errorPlotData[0];
				if(errorPlot&&calcMain)
				{
					output.localErrorPlotData=errorPlotData[1];
					output.globalErrorPlotData=errorPlotData[2];
					output.errorIndicies.push(i);
				}
				if(eigenvaluePlot)
					output.eigenvaluePlotData=eigenvalueData;
			}
	}
}

var parallelSolver=new ParallelSolver();


module.exports=parallelSolver;



