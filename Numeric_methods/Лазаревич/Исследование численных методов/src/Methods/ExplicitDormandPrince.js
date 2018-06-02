class ExplicitDormandPrince
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
	AutoStep(data,complexity)
	{
		var count=data.xv.length;
		var k=new Array(7);
		for(var i=0;i<7;i++)
		{
			k[i]=new Array(count);
		}
		var ktemp=data.xv.slice();
		var aIterator=0;
		var t_i=data.t;
		for(var i=0;i<6;i++)
		{
			for(var j=0;j<count;j++)
				k[i][j]=this.funcs[j](ktemp,t_i)*this.step;
			var tIterator=aIterator;
			for(var j=0;j<count;j++)
			{
				aIterator=tIterator;
				var temp=0;
				for(var l=0;l<=i;l++)
				{
					temp+=EDP.a[aIterator]*k[l][j];
					aIterator++;
				}
				ktemp[j]=temp+data.xv[j];
			}
			t_i=data.t+EDP.c[i]*this.step;
			//console.log('ktemp '+ktemp);
		}
		for(var j=0;j<count;j++)
			k[6][j]=this.funcs[j](ktemp,t_i)*this.step;
		var difference=0;
		for(var j=0;j<count;j++)//find max norm |x|=max(x(j)), j=1,n
		{	
			var tempDifference=0;
			for(var i=0;i<7;i++)
			{
				tempDifference+=EDP.kdiff[i]*k[i][j];
			}
			tempDifference=Math.abs(tempDifference);
			difference=Math.max(difference,tempDifference);
		}
		var stepOpt=Math.pow(this.errorTolerance*this.step*0.5/difference,0.20)*this.step;
		//console.log(stepOpt);
		if(isNaN(stepOpt))
		{
			stepOpt=this.minStep;
		}
		stepOpt=Math.min(Math.max(this.minStep,stepOpt),this.maxStep);
		complexity.rightSideEvaluation+=8*count;
		if(stepOpt*2<this.step)
		{
			this.step=stepOpt;
			Step(data,complexity);
			return;
		}else
		{
			for(var i=0;i<6;i++)
			{
				for(var j=0;j<count;j++)
					data.xv[j]+=k[i][j]*EDP.b1[i];
			}
		}
		complexity.currentStep=this.step;
		complexity.averageStep+=this.step;
		data.t+=this.step;
		this.step=stepOpt;

	}
	NormalStep(data,complexity)
	{
		var count=data.xv.length;
		var k=new Array(6);
		for(var i=0;i<6;i++)
		{
			k[i]=new Array(count);
		}
		var ktemp=data.xv.slice();
		var aIterator=0;
		var t_i=data.t;
		for(var i=0;i<5;i++)
		{
			for(var j=0;j<count;j++)
				{
					k[i][j]=this.funcs[j](ktemp,t_i)*this.step;
				}
			var tIterator=aIterator;
			for(var j=0;j<count;j++)
			{
				aIterator=tIterator;
				var temp=0;
				for(var l=0;l<=i;l++)
				{
					temp+=EDP.a[aIterator]*k[l][j];
					aIterator++;
				}
				ktemp[j]=temp+data.xv[j];
			}
			t_i=data.t+EDP.c[i]*this.step;
		}
		for(var j=0;j<count;j++)
			k[5][j]=this.funcs[j](ktemp,t_i)*this.step;
		for(var i=0;i<6;i++)
		{
			for(var j=0;j<count;j++)
				data.xv[j]+=k[i][j]*EDP.b1[i];
		}
		//console.log(data.xv);
		data.t+=this.step;
		complexity.rightSideEvaluation+=count*7;
		complexity.currentStep=this.step;
		complexity.averageStep+=this.step;
		
	}
}
let EDP=ExplicitDormandPrince;
EDP.a=[1/5,
3/40,9/40,
44/45,-56/15, 32/9,
19372/6561,-25360/2187, 64448/6561,-212/729,
9017/3168,-355/33, 46732/5247,49/176,-5103/18656,
35/384,0,500/1113,125/192,-2187/6784,11/84
];
EDP.b1=[35/384,0,500/1113,125/192,-2187/6784,11/84];
EDP.b2=[5179/57600,0,7571/16695,393/640,-92097/339200,187/2100,1/40];
EDP.c=[1/5,3/10,4/5,8/9,1,1];
EDP.kdiff=[71/57600,0,-71/16695,71/1920,-17253/339200,22/525,-1/40];


ExplicitDormandPrince.attributes={name:'Метод Дорманда-Принса 5 порядка'};
ExplicitDormandPrince.options=['autoStepEnabled'];

export default ExplicitDormandPrince;