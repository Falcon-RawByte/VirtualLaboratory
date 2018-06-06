class ExplicitRKGeneral
{
	constructor()
	{
		this.step=0;
		this.funcs=null;
		this.stages=1;
		this.a=[[]];
		this.b=[];
		this.c=[];
	}
	Init(options)
	{
		this.step=options.step;
		this.funcs=options.funcsVector;
	}
	Step(data,complexity)
	{
		var count=data.xv.length;
		var k=new Array(this.stages*count);
		var ktemp=new Array(count);
		var t=data.t;
		for(var i=0;i<this.stages;i++)
		{
			for(var j=0;j<count;j++)
			{
				var temp=0;
				for(var l=0;l<i;l++)
				{
					temp+=k[l*count+j]*this.a[i-1][l];
				}
				ktemp[j]=data.xv[j]+this.step*temp;
			}
			for(var j=0;j<count;j++)
			{
				k[i*count+j]=this.funcs[j](ktemp,t+this.step*this.c[i]);
			}
		}
		for(var j=0;j<count;j++)
		{
			var temp=0;
			for(var i=0;i<this.stages;i++)
			{
				temp+=k[i*count+j]*this.b[i];
			}
			data.xv[j]+=temp*this.step;
		}

		//console.log(data.xv);
		data.t+=this.step;
		complexity.rightSideEvaluation+=count*this.stages;
		complexity.currentStep=this.step;
		complexity.averageStep+=this.step;
	}
}
export default ExplicitRKGeneral;








