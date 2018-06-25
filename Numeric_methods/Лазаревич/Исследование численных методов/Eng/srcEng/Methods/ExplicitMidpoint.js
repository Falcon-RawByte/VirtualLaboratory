class ExplicitMidpoint
{
	constructor()
	{
		this.step=0;
		this.funcs=null;
	}
	Init(options)
	{
		this.step=options.step;
		this.funcs=options.funcsVector;
	}
	Step(data,complexity)
	{
		var count=data.xv.length;
		let t_average=data.t+this.step*0.5;
		var temp=new Array(count);
		for(var i=0;i<count;i++)
		{
			temp[i]=(data.xv[i]+this.funcs[i](data.xv,data.t)*this.step*0.5);
		}
		for(var i=0;i<count;i++)
		{
			data.xv[i]+=this.step*this.funcs[i](temp,t_average);
		}
		data.t+=this.step;
		complexity.rightSideEvaluation+=2*count;
		complexity.currentStep=this.step;
		complexity.averageStep+=this.step;
		
	}
}
ExplicitMidpoint.attributes={name:'Explicit midpoint method'};

export default ExplicitMidpoint;