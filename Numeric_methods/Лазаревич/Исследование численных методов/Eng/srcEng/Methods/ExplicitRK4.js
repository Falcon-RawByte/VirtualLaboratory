class ExplicitRK4
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
		var k=new Array(4*count);
		var ktemp=new Array(count);
		for(var i=0;i<count;i++)
		{
			k[i]=this.step*this.funcs[i](data.xv,data.t);
			ktemp[i]=data.xv[i]+k[i]*0.5;
		}
		for(var i=0;i<count;i++)
		{
			k[count+i]=this.step*this.funcs[i](ktemp,data.t+this.step*0.5);
		}
		for(var i=0;i<count;i++)
		{
			ktemp[i] = data.xv[i] + k[count + i] * 0.5;
		}
		var count2 = count +count;
		for (var i = 0; i < count; i++)
		{	
			k[count2 + i] =this.step*this.funcs[i](ktemp, data.t +this.step*0.5);
		}
		for(var i=0;i<count;i++)
		{
			ktemp[i] = data.xv[i] + k[count2 + i];
		}
		var count3 = count + count2;
		for (var i = 0; i < count; i++)
			k[count3 + i] =this.step*this.funcs[i](ktemp, data.t +this.step);
		var koeff = 1.0 / 6.0;
		for (var i = 0; i < count; i++)
			data.xv[i] += koeff*(k[i] + 2.*(k[i + count] + k[i + count2]) + k[i + count3]);
		data.t+=this.step;
		complexity.rightSideEvaluation+=count*4;
		complexity.currentStep=this.step;
		complexity.averageStep+=this.step;	
	}
}
ExplicitRK4.attributes={name:'Explicit Runge-Kutta 4th order method'};

export default ExplicitRK4;