import gaussSolve from "../gauss.js";
import ImplicitLobatto3C from "./ImplicitLobatto3C.js";


class AdamsMulton
{

	constructor()
	{
		this.coefficients=[
		[0.5],
		[2/3,-1/12],
		[19/24,-5/24,1/24],
		[323/360,-11/30,53/360,-19/720],
		[1427/1440,-133/240,241/720,-173/1440,3/160]
		];
		this.stepCoeffs=[1,0.5,5/12,3/8,251/720,95/288];
		this.max_iteration=10;
		this.Method=new ImplicitLobatto3C();
		this.methodOptions={
				f_abs_error:0.001,
				max_newton_iterations:5,
				min_newton_abs_change:0.01,
				min_newton_rel_change:0.1,
				k_abs_error:0.001
			};
	}
	Init(options)
	{
		this.counter=1;
		this.step=options.step;
		this.funcs=options.funcsVector;
		this.maxOrder=options.maxOrder!==undefined?Math.max(1,Math.min(5,options.maxOrder)):5;
		this.points=new Array(/*maxOrder*funcs.length*/);
		//console.log(maxOrder);
		this.jacobianConst=(options.jacobianConst==true?true:false);
		var count=this.funcs.length;
		this.jacobian_m=new Array(count*count);
		if(this.maxOrder==1)
		{
			if(options.jacobianCalc==true)
			{
				this.jacobian=options.jacobian;
				this.Step=this.StepGeneralAnalytic;
			}else
			{
				this.Step=this.StepGeneralNumeric;
			}
			return;
		}else{
			if(options.jacobianCalc==true)
			{
				this.jacobian=options.jacobian;
				this.Step=this.StepFirstAnalytic;
			}else
			{
				this.Step=this.StepFirstNumeric;
			}
		}
		this.Method.Init(options);
	}
	StepFirstNumeric(data,complexity)
	{
		for(var i=this.funcs.length-1;i>-1;i--)
		{
			this.points.unshift(this.step*this.funcs[i](data.xv,data.t));
		}
		this.Method.Step(data,complexity);
		this.counter++;
		if(this.counter==this.maxOrder)
		{
			this.Step=this.StepGeneralNumeric;
		}
	}
	StepFirstAnalytic(data,complexity)
	{
		for(var i=this.funcs.length-1;i>-1;i--)
		{
			this.points.unshift(this.step*this.funcs[i](data.xv,data.t));
		}
		this.Method.Step(data,complexity);
		this.counter++;
		if(this.counter==this.maxOrder)
		{
			this.Step=this.StepGeneralAnalytic;
		}
	}
	F(yn_s,b_s,stepCoeff,step,func,yn_v,tn_s)
	{
		return yn_s-b_s-stepCoeff*step*func(yn_v,tn_s);
	}
	dF(delta,step,stepCoeff,df,yn_v,tn)
	{
		return delta-step*stepCoeff*df(yn_v,tn);
	}
	dFNumeric(delta,step,stepCoeff,df)
	{
		return delta-step*stepCoeff*df;
	}
	StepGeneralNumeric(data,complexity)
	{
		var count=data.xv.length;

		//console.log('postsplice: '+points);
		//console.log(points);
		var b_v=new Array(data.xv.length);
		for(var i=0;i<count;i++)
			b_v[i]=data.xv[i];
		for(var j=0;j<this.counter-1;j++)
		{
			for(var i=0;i<count;i++)
				b_v[i]+=this.points[i+j*count]*this.coefficients[this.counter-1][j];
		}
		if(this.counter>1)
		{
			this.points.splice((this.maxOrder-2)*count,count);
			for(var i=count-1;i>-1;i--)
			{
				this.points.unshift(this.step*this.funcs[i](data.xv,data.t));
			}
			complexity.rightSideEvaluation+=count;
		}

		var max_iteration=10;
		var f=new Array(count);
		var y=data.xv.slice();
		var t_next=data.t+this.step;
		var y_old=data.xv.slice();
		var jacobianStep=0.001;
		var k=0;
		var stepCoeff=this.stepCoeffs[this.counter-1];
		var last_f_difference=0;
		if(this.jacobianConst==true)
		{
			for(var j=0;j<count;j++)
			{
				for(var i=0;i<count;i++)
				{//df=y+jstep-h*f(t,y+jstep)-y+h*f(t,y)
					var y_temp=y[i];
					var df=(this.funcs[j](y,t_next));
					y[i]+=jacobianStep;
					df=(this.funcs[j](y,t_next)-df);
					df/=jacobianStep;
					df=this.dFNumeric(i==j?1.0:0.0,this.step,stepCoeff,df);
					this.jacobian_m[i+j*count]=df;
					y[i]=y_temp;
				}
			}
		}
		for(var i=0;i<count;i++)
		{
			f[i]=-this.F(y[i],b_v[i],stepCoeff,this.step,this.funcs[i],y,t_next);
			last_f_difference=Math.max(last_f_difference,Math.abs(f[i]));
		}
		while(true)
		{
			
			//solve system J(y_new(i))(dy)=-F(y_new(i))
			//y_new(0)=y_old
			var dy;
			if(this.jacobianConst==true)
			{
				var jacobian_t=this.jacobian_m.slice();
				dy=gaussSolve(jacobian_t,f);
			}else
			{
				for(var j=0;j<count;j++)
				{
					for(var i=0;i<count;i++)
					{//df=y+jstep-h*f(t,y+jstep)-y+h*f(t,y)
						var y_temp=y[i];
						var df=(this.funcs[j](y,t_next));
						y[i]+=jacobianStep;
						df=(this.funcs[j](y,t_next)-df);
						df/=jacobianStep;
						df=this.dFNumeric(i==j?1.0:0.0,this.step,stepCoeff,df);
						this.jacobian_m[i+j*count]=df;
						y[i]=y_temp;
					}
				}
				dy=gaussSolve(this.jacobian_m,f);
			}
			let y_difference=0;//max norm for dy
			for(var i=0;i<count;i++)
			{
				y_difference=Math.max(Math.abs(dy[i]),y_difference);
				y[i]+=dy[i];
			}
			k++;
			var f_difference=0;//max norm for F(y_old+dy)
			for(var i=0;i<count;i++)
			{
				f[i]=-this.F(y[i],b_v[i],stepCoeff,this.step,this.funcs[i],y,t_next);
				f_difference=Math.max(f_difference,Math.abs(f[i]));
			}
			if(last_f_difference>=f_difference)
			{
				for(var i=0;i<count;i++)//remember last optimal solution
				{
					data.xv[i]=y[i];
				}
				last_f_difference=f_difference;
			}
			if(f_difference<this.methodOptions.f_abs_error)
			{
				break;
			}
			else if(k>=this.max_iteration)
			{	
				break;//return xv
			}
			if(y_difference<this.methodOptions.y_abs_error)
			{
				break;
			}
		}
		complexity.rightSideEvaluation+=(k+1)*count;
		complexity.matrixSolving+=k;
		complexity.currentStep=this.step;
		complexity.averageStep+=this.step;
		if(this.jacobianConst!=true)
			complexity.rightSideEvaluation+=count*count*k*2;
		else
			complexity.rightSideEvaluation+=count*count*2;
		//complexity.rightSideEvaluation+=(k+1)*count;
		data.t+=this.step;
		return;
	}
	StepGeneralAnalytic(data,complexity)
	{
		var count=data.xv.length;

		//console.log('postsplice: '+points);
		//console.log(points);
		var b_v=new Array(data.xv.length);
		for(var i=0;i<count;i++)
			b_v[i]=data.xv[i];
		for(var j=0;j<this.counter-1;j++)
		{
			for(var i=0;i<count;i++)
				b_v[i]+=this.points[i+j*count]*this.coefficients[this.counter-1][j];
		}
		if(this.counter>1)
		{
			this.points.splice((this.maxOrder-2)*count,count);
			for(var i=count-1;i>-1;i--)
			{
				this.points.unshift(this.step*this.funcs[i](data.xv,data.t));
			}
			complexity.rightSideEvaluation+=count;
		}
		var f=new Array(count);
		var y=data.xv.slice();
		var t_next=data.t+this.step;
		var y_old=data.xv.slice();
		var k=0;
		var stepCoeff=this.stepCoeffs[this.counter-1];
		var last_f_difference=0;
		if(this.jacobianConst==true)
		{
			for(var j=0;j<count;j++)
			{
				for(var i=0;i<count;i++)
				{	
					var df=this.dF(i==j?1:0,this.step,stepCoeff,this.jacobian[i+j*count],y,t_next);
					this.jacobian_m[i+j*count]=df;
				}
			}
		}
		for(var i=0;i<count;i++)
		{
			f[i]=-this.F(y[i],b_v[i],stepCoeff,this.step,this.funcs[i],y,t_next);
			last_f_difference=Math.max(last_f_difference,Math.abs(f[i]));
		}
		while(true)
		{
			//solve system J(y_new(i))(dy)=-F(y_new(i))
			//y_new(0)=y_old
			var dy;
			if(this.jacobianConst==true)
			{
				var jacobian_t=this.jacobian_m.slice();
				dy=gaussSolve(jacobian_t,f);
			}
			else
			{
				for(var j=0;j<count;j++)
				{
					for(var i=0;i<count;i++)
					{	
						var df=this.dF(i==j?1:0,this.step,stepCoeff,this.jacobian[i+j*count],y,t_next);
						this.jacobian_m[i+j*count]=df;
					}
				}
				dy=gaussSolve(this.jacobian_m,f);
			}
			let y_difference=0;//max norm for dy
			for(var i=0;i<count;i++)
			{
				y_difference=Math.max(Math.abs(dy[i]),y_difference);
				y[i]+=dy[i];
			}
			var f_difference=0;//max norm for F(y_old+dy)
			for(var i=0;i<count;i++)
			{
				f[i]=-this.F(y[i],b_v[i],stepCoeff,this.step,this.funcs[i],y,t_next);
				f_difference=Math.max(f_difference,Math.abs(f[i]));
			}
			if(last_f_difference>=f_difference)
			{
				for(var i=0;i<count;i++)//remember last optimal solution
				{
					data.xv[i]=y[i];
				}
				last_f_difference=f_difference;
			}
			k++;
			if(f_difference<this.methodOptions.f_abs_error)
			{
				break;
			}
			else if(k>=this.max_iteration)
			{	
				break;//return xv
			}
			else if(y_difference<this.methodOptions.y_abs_error)
			{
				break;
			}
		}
		complexity.rightSideEvaluation+=(k+1)*count;
		complexity.matrixSolving+=k;
		complexity.currentStep=this.step;
		complexity.averageStep+=this.step;
		if(this.jacobianConst!=true)
			complexity.jacobianCalculations+=count*count*k;
		else
			complexity.jacobianCalculations+=count*count;
		data.t+=this.step;
		return;
	}
}

AdamsMulton.attributes={name:"Неявные методы Адамса-Мультона"};
AdamsMulton.options=["chooseOrderEnabled",'jacobianMatrixEnabled'];
AdamsMulton.minOrder=1;
AdamsMulton.maxOrder=6;

export default AdamsMulton;