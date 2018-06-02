import ExplicitDormandPrince from './ExplicitDormandPrince.js';
class AdamsBashfortMethodFixedStep
{
	constructor()
	{
		this.step;
		this.points=null;
		this.maxOrder;
		this.counter;
		this.funcs;
		this.DP=new ExplicitDormandPrince();
		this.Step=this.StepFirst;
	}
	Init(options)
	{
		this.counter=1;
		this.step=options.step;
		this.funcs=options.funcsVector;
		this.maxOrder=options.maxOrder!==undefined?Math.max(1,Math.min(5,options.maxOrder)):5;
		this.points=new Array(/*maxOrder*funcs.length*/);
		//console.log(maxOrder);
		if(this.maxOrder==1)
		{
			this.Step=this.StepGeneral;
			return;
		}else{
			this.Step=this.StepFirst;
		}
		this.DP.Init(options);
		//this.DP.Init({minStep:step,maxStep:step,step:step,funcsVector:funcs});
	}
	StepFirst(data,complexity)
	{
		for(var i=this.funcs.length-1;i>-1;i--)
		{
			this.points.unshift(this.funcs[i](data.xv,data.t));
		}
		this.DP.Step(data,complexity);
		this.counter++;
		if(this.counter==this.maxOrder)
		{
			this.Step=this.StepGeneral;
		}
	}
	StepGeneral(data,complexity)
	{
		var count=data.xv.length;

		this.points.splice((this.maxOrder-1)*count,count);
		//console.log('postsplice: '+points);
		for(var i=count-1;i>-1;i--)
		{
			this.points.unshift(this.funcs[i](data.xv,data.t));
		}
		//console.log(points);
		for(var j=0;j<this.counter;j++)
		{
			for(var i=0;i<count;i++)
				data.xv[i]+=this.step*this.points[i+j*count]*AB.coefficients[this.counter-1][j];
		}
		complexity.rightSideEvaluation+=count;
		complexity.currentStep=this.step;
		complexity.averageStep+=this.step;
		data.t+=this.step;
	}
}
let AB=AdamsBashfortMethodFixedStep;
AB.coefficients=[
			[1],
			[1.5,-0.5],
			[23/12,-4/3,5/12],
			[55/24,-59/24,37/24,-3/8],
			[1901/720,-1387/360,109/30,-637/360,251/720]];
AdamsBashfortMethodFixedStep.attributes={name:"Явные методы Адамса-Башфорта"};
AdamsBashfortMethodFixedStep.options=["chooseOrderEnabled"];
AdamsBashfortMethodFixedStep.minOrder=1;
AdamsBashfortMethodFixedStep.maxOrder=5;

export default AdamsBashfortMethodFixedStep;