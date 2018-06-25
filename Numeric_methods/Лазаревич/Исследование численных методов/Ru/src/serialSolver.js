import {Methods} from './methods.js';
import $ from 'jquery';
import QRAlgorithm from "./QRAlgorithm.js";

class SerialSolver
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
	solve(methods,taskParameters,outputParameters,progressCallback,task)
	{
		/*methods=[
		{methodId:,methodOptions:},

		];
		taskParameters={t0:,dt:,functions,jacobianFunction};
		outputParameters={
			errorMethod://int
			,plot:[]//bool
			,plott1
			,plott0
			,eigenvaluePlot
			,errorPlot
		};
		var plot=false;

		if(eigenvaluePlot||errorMethod!=-1)//if i need to calc error or show eigenvaluePlot i should calc batches of data and quickly calc error for them
		{


		}else
		{
			var l=methods.length();
			for(var i=0;i<l;i++)
			{



			}
		}*/

		let parameters=taskParameters.parameters.slice();
		for(var i=0;i<parameters.length;i++)
			parameters[i]=parseFloat(parameters[i]);

		var funcsVector=task.getFunctions(parameters);
		var jacobian=task.getJacobian!==undefined?task.getJacobian(parameters):undefined;
		var t0=parseFloat(taskParameters.argument);
		var tLast=parseFloat(taskParameters.argumentInterval)+t0;
		var jacobian2=jacobian!==undefined?jacobian:funcsVector;
		var useJacobian=jacobian!==undefined?true:false;

		var output=
		{
			statistics:[],
			methods:[],
			plots:[],
			localErrorPlots:[],
			globalErrorPlots:[],
			eigenvaluePlots:[],
			timeArrays:[],
			errorIndicies:[]
		};
		var progress=0;
		var lastTime=performance.now();

		var t0Plot=outputParameters.plotInterval[0];
		var t1Plot=outputParameters.plotInterval[1];


		let plotIntervalCondition=!(t0Plot>=t1Plot);
		let eigenvaluePlot=outputParameters.eigenvaluePlot&&plotIntervalCondition;
		let errorPlot=outputParameters.errorPlot&&plotIntervalCondition;
		let Main=outputParameters.errorMethod;
		let calcMain=outputParameters.errorMethod!=-1&&outputParameters.errorMethod<methods.length;

		let plotCondition=eigenvaluePlot||errorPlot;
		var variables=taskParameters.variables.slice();
		var count=task.variables.length+1;
		for(var i=0;i<count-1;i++)
			variables[i]=parseFloat(variables[i]);
		let plotVariables=new Array(count);
		let plotIndicies=new Array(count);
		let plots=new Array();
		for(var i=0;i<outputParameters.plots.length;i++)
		{
			if(outputParameters.plots[i]==true)
			{
				plotVariables[task.plotInfo[i].x.index]=true;
				plotVariables[task.plotInfo[i].y.index]=true;
				if(task.plotInfo[i].z!==undefined)
				{
					plotVariables[task.plotInfo[i].z.index]=true;
				}
				plotCondition=true||plotCondition;
				plots.push({index:i,plotData:new Array()});
			}
		}
		plotCondition=plotCondition&&((t0Plot<t1Plot)&&t0Plot<tLast);


		let plotArray=new Array();
		plotVariables.forEach(function(el,index)
		{
			if(el==true&&index!=count-1)
			{
				plotIndicies[index]=plotArray.length;
				plotArray.push({index:index});
			}
		});
		plotIndicies[count-1]=plotArray.length;
		plotArray.push({index:count-1});

		var lastDifference=new Array(count-1);
		for(var i=0;i<methods.length;i++)
		{
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

			let solver=new Methods[methods[i].parameters.selectedMethod]();
			solver.Init({
					step:parseFloat(methods[i].parameters.stepValue)*0.001,
					funcsVector:funcsVector,
					minStep:parseFloat(methods[i].parameters.stepValue)*0.001,
					maxStep:Math.max(parseFloat(methods[i].parameters.stepValue),parseFloat(methods[i].parameters.maxstepValue))*0.001,
					errorTolerance:parseFloat(methods[i].parameters.errorValue),
					jacobianCalc:useJacobian&&(methods[i].parameters.jacobianSelected==1?false:true),
					jacobian:jacobian,
					jacobianConst:methods[i].parameters.useConstMatrix,
					maxOrder:methods[i].parameters.selectedOrder
					});
			for(var j=0;j<count-1;j++)
			{
				lastDifference[j]=0;
			}
			let complexity={rightSideEvaluation:0,currentStep:0,averageStep:0,stepCount:0,matrixSolving:0,jacobianCalculations:0};
			let localError=undefined;
			let globalError=undefined;
			let maxLocalError=undefined;
			let maxGlobalError=undefined;
			var finalGlobalError=undefined;
			let xvt={xv:variables.slice(),t:t0};
			if((i==Main&&calcMain)||(!calcMain))
			{
				var condition=xvt.t<=tLast;
				while(condition)
				{
					if(xvt.t>=tLast)
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
				}
			}else
			{
				localError=0;
				globalError=0;
				maxLocalError=0;
				maxGlobalError=0;
				finalGlobalError=0;
				let mainComplexity={rightSideEvaluation:0,currentStep:0,averageStep:0,stepCount:0,matrixSolving:0,jacobianCalculations:0};
				let xvtMain={xv:variables.slice(),t:t0};
				let xvt={xv:variables.slice(),t:t0};
				let lastxvt={xv:xvtMain.xv.slice(),t:xvtMain.t};
				let mainSolver=new Methods[methods[Main].parameters.selectedMethod]();
				//Object.assign({},Methods[methods[Main].parameters.selectedMethod]);
				mainSolver.Init({
					step:parseFloat(methods[Main].parameters.stepValue)*0.001,
					funcsVector:funcsVector,
					minStep:parseFloat(methods[Main].parameters.stepValue)*0.001,
					maxStep:Math.max(parseFloat(methods[Main].parameters.stepValue),parseFloat(methods[Main].parameters.maxstepValue))*0.001,
					errorTolerance:parseFloat(methods[Main].parameters.errorValue),
					jacobianCalc:useJacobian&&(methods[Main].parameters.jacobianSelected==1?false:true),
					jacobian:jacobian,
					jacobianConst:methods[Main].parameters.useConstMatrix,
					maxOrder:methods[Main].parameters.selectedOrder
					});
				let condition=(xvt.t<=tLast);
				let prevT=xvt.t;
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
						let tempLocal=localErrorValue;
						let tempGlobal=globalErrorValue;
						globalErrorValue=Math.sqrt(globalErrorValue);
						localErrorValue=Math.sqrt(localErrorValue);
						maxGlobalError=Math.max(globalErrorValue,maxGlobalError);
						maxLocalError=Math.max(localErrorValue,maxLocalError);
						localError+=Math.abs(0.5*(localErrorValue+tempLocal)*(t-prevT));
						globalError+=Math.abs(0.5*(globalErrorValue+tempGlobal)*(t-prevT));
						prevT=t;
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
						let tempLocal=localErrorValue;
						let tempGlobal=globalErrorValue;
						globalErrorValue=Math.sqrt(globalErrorValue);
						localErrorValue=Math.sqrt(localErrorValue);
						localError+=Math.abs(0.5*(localErrorValue+tempLocal)*(t-prevT));
						globalError+=Math.abs(0.5*(globalErrorValue+tempGlobal)*(t-prevT));
						prevT=t;


						maxGlobalError=Math.max(globalErrorValue,maxGlobalError);
						maxLocalError=Math.max(localErrorValue,maxLocalError);
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
				localError/=(xvt.t-t0);
				globalError/=(xvt.t-t0);
			}
			//copy results
			complexity.averageStep/=Math.max(1,complexity.stepCount);
			output.statistics.push({
				localError:localError,
				globalError:globalError,
				maxLocalError:maxLocalError,
				maxGlobalError:maxGlobalError,
				finalGlobalError:finalGlobalError,
				calculations:complexity.rightSideEvaluation,
				jacobianCalculations:complexity.jacobianCalculations,
				matrixSolving:complexity.matrixSolving,
				averageStep:complexity.averageStep});

			output.methods.push({name:methods[i].parameters.selectedMethod,color:i});

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
				output.timeArrays.push(errorPlotData[0]);
				if(errorPlot&&calcMain)
				{
					output.localErrorPlots.push(errorPlotData[1]);
					output.globalErrorPlots.push(errorPlotData[2]);
					output.errorIndicies.push(i);
				}
				if(eigenvaluePlot)
					output.eigenvaluePlots.push(eigenvalueData);
			}
		}
		output.plots=plots;
		return output;
	}
}

var serialSolver=new SerialSolver();


module.exports=serialSolver;