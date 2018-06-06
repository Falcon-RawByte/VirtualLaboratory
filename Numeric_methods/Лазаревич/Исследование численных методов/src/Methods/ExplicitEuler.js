class ExplicitEulerMethod
{
	constructor()
	{
		this.step=0;
		this.minStep=0;
		this.maxStep=0;
		this.errorTolerance=0;
		this.funcs=null;
		this.Step=this.NormalStep;
	}
	Init(options)
	{
		this.step=options.step;
		this.funcs=options.funcsVector;
		this.minStep=(options.minStep!==undefined?options.minStep:0.01);
		this.maxStep=(options.maxStep!==undefined?options.maxStep:0.2);
		this.errorTolerance=(options.errorTolerance!==undefined?options.errorTolerance:0.001);
		if(this.minStep==this.maxStep)
		{
			this.Step=this.NormalStep;
		}else
		{
			this.Step=this.AutoStep;
		}
	}
	NormalStep(data,complexity)
	{
		var count=data.xv.length;
		var k=new Array(count);
		for(var i=0;i<count;i++)
		{
			k[i]=this.step*this.funcs[i](data.xv,data.t);
		}
		for(var i=0;i<count;i++)
			data.xv[i]+=k[i];
		data.t+=this.step;
		complexity.rightSideEvaluation+=count;
		complexity.currentStep=this.step;
		complexity.averageStep+=this.step;
	}
	AutoStep(data,complexity)
	{
		var count=data.xv.length;
		var k=new Array(count);
		var k2=new Array(count);
		var halfstep=this.step*0.5;
		for(var i=0;i<count;i++)
		{
			k[i]=this.funcs[i](data.xv,data.t);
			k2[i]=k[i]*halfstep;
			k[i]*=this.step;
			k[i]+=data.xv[i];
		}
		var xvTemp=new Array(count);
		for(var i=0;i<count;i++)
			xvTemp[i]=data.xv[i]+k2[i];
		for(var i=0;i<count;i++)
		{
			k2[i]=xvTemp[i]+halfstep*this.funcs[i](xvTemp,data.t+halfstep);
		}
		var difference=0;
		for(var i=0;i<count;i++)
		{
			var t=k2[i]-k[i];
			difference+=(t*t);
		}
		difference=Math.sqrt(difference);
		var delta_calc=0.9*Math.sqrt(this.errorTolerance/difference)*this.step;
		//console.log(delta_calc);
		var tStep=this.step;
		this.step=Math.min(Math.max(this.minStep,delta_calc),this.maxStep);
		if(isNaN(this.step)||this.step==undefined)
		{
			this.step=this.minStep;
		}
		complexity.rightSideEvaluation+=count*2;
		if(this.step<halfstep)//если шаг меньше половины иходного, посчитать заново
		{
			return this.Step(data,complexity);
		}
		complexity.currentStep=tStep;
		complexity.averageStep+=tStep;
		data.t+=tStep;
		data.xv=k2;
	}
}
ExplicitEulerMethod.attributes={name:'Явный метод Эйлера с автошагом'}
ExplicitEulerMethod.options=['autoStepEnabled'];

export default ExplicitEulerMethod;