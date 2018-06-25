import gaussSolve from "../gauss.js";
import ImplicitLobatto3C from "./ImplicitLobatto3C.js";



class BackwardDifferentiationFormulas
{
	constructor()
	{
		this.step=0;
		this.funcs;
		this.jacobianConst=false;
		this.jacobian=null;
		this.jacobian_m;
		this.counter=0;
		this.points=null;
		this.maxOrder=1;
		this.counter=1;
		this.methodOptions={
			f_abs_error:0.001,
			max_newton_iterations:5,
			min_newton_abs_change:0.01,
			min_newton_rel_change:0.1,
			y_abs_error:0.001
		};
		this.coefficients=[
			[1],
			[4/3,-1/3],
			[18/11,-9/11,2/11],
			[48/25,-36/25,16/25,-3/25],
			[300/137,-300/137,200/137,-75/137,12/137],
			[360/147,-450/147,400/147,225/147,72/147,-10/147]];
			this.stepCoeffs=[1,2/3,6/11,12/25,60/137,60/147];
		this.max_iteration=10;
		this.methodOptions={
				f_abs_error:0.001,
				max_newton_iterations:5,
				min_newton_abs_change:0.01,
				min_newton_rel_change:0.1,
				k_abs_error:0.001
		};
		this.Method=new ImplicitLobatto3C();
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
	StepFirstNumeric(data,complexity)
	{
		for(var i=this.funcs.length-1;i>-1;i--)
		{
			this.points.unshift(data.xv[i]);
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
			this.points.unshift(data.xv[i]);
		}
		this.Method.Step(data,complexity);
		this.counter++;
		if(this.counter==this.maxOrder)
		{
			this.Step=this.StepGeneralAnalytic;
		}
	}
	StepGeneralNumeric(data,complexity)
	{
		var count=data.xv.length;

		this.points.splice((this.maxOrder-1)*count,count);
		//console.log('postsplice: '+points);
		for(var i=count-1;i>-1;i--)
		{
			this.points.unshift(data.xv[i]);
		}
		//console.log(points);
		var b_v=new Array(data.xv.length);
		for(var i=0;i<count;i++)
			b_v[i]=0;
		for(var j=0;j<this.counter;j++)
		{
			for(var i=0;i<count;i++)
				b_v[i]+=this.points[i+j*count]*this.coefficients[this.counter-1][j];
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
		for(var i=0;i<count;i++)
		{
			f[i]=-this.F(y[i],b_v[i],stepCoeff,this.step,this.funcs[i],y,t_next);
			last_f_difference=Math.max(last_f_difference,Math.abs(f[i]));
		}

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

		this.points.splice((this.maxOrder-1)*count,count);
		//console.log('postsplice: '+points);
		for(var i=count-1;i>-1;i--)
		{
			this.points.unshift(data.xv[i]);
		}
		//console.log(points);
		var b_v=new Array(data.xv.length);
		for(var i=0;i<count;i++)
			b_v[i]=0;
		for(var j=0;j<this.counter;j++)
		{
			for(var i=0;i<count;i++)
				b_v[i]+=this.points[i+j*count]*this.coefficients[this.counter-1][j];
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

BackwardDifferentiationFormulas.attributes={name:"Формулы обратного дифференцирования"};
BackwardDifferentiationFormulas.options=["chooseOrderEnabled",'jacobianMatrixEnabled'];
BackwardDifferentiationFormulas.minOrder=1;
BackwardDifferentiationFormulas.maxOrder=6;

export default BackwardDifferentiationFormulas;