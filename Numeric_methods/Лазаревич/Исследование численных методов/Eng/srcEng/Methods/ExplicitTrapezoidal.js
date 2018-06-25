class ExplicitTrapezoidal
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
		var k=new Array(count);
		var temp=new Array(count);
		for(var i=0;i<count;i++)
		{
			temp[i]=data.xv[i]+this.funcs[i](data.xv,data.t)*this.step;
		}
		var t_next=data.t+this.step;
		for(var i=0;i<count;i++)
		{
			//k[i]=delta*0.5*(funcs[i](t,xv)+funcs[i](t_next,t));
			data.xv[i]=(this.funcs[i](temp,t_next)*this.step+temp[i]+data.xv[i])*0.5;
		}
		data.t+=this.step;
		complexity.rightSideEvaluation+=count*2;
		complexity.currentStep=this.step;
		complexity.averageStep+=this.step;
		
	}
}
ExplicitTrapezoidal.attributes={name:'Explicit trapezoidal rule method'};

export default ExplicitTrapezoidal;