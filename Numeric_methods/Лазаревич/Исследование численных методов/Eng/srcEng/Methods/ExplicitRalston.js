class ExplicitRalston
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
		var k1=new Array(count);
		var ktemp=new Array(count);
		for(var i=0;i<count;i++)
		{
			k1[i]=this.funcs[i](data.xv,data.t)*this.step;
			ktemp[i]=k1[i]*0.666667+data.xv[i];
			data.xv[i]+=k1[i]*0.25;
		}
		var t_next=data.t+this.step*0.666667;
		for(var i=0;i<count;i++)
		{
				//k2 = h f(xi + 2 h / 3, yi + 2 k1 / 3 )
			data.xv[i]+=0.75*this.funcs[i](ktemp,t_next)*this.step;
		}
		data.t+=this.step;
		complexity.rightSideEvaluation+=count*2.0;
		complexity.currentStep=this.step;
		complexity.averageStep+=this.step;
		
	}
}
ExplicitRalston.attributes={name:'Explicit Ralston 2nd order method'};

export default ExplicitRalston;