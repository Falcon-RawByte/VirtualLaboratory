import gaussSolve from "../gauss.js";
class ImplicitEuler
{
	constructor()
	{
		this.step=0;
		this.funcs=null;
		this.jacobianConst=false;
		this.jacobian=null;
		this.jacobian_m=null;

	}
	BIGF(y_old_s,y_new_s,step,func_s,t_next,y_new_v)//s for scalar, v for vector
			//F(y(s+1))=y(s+1)-y(s)-h*f(t(s+1),y(s+1))
	{	
		var t=y_new_s-y_old_s-step*func_s(y_new_v,t_next);
		return t;
	}
	Init(options)
	{
		this.step=options.step;
		this.funcs=options.funcsVector;
		if(options.jacobianCalc==true)
		{
			this.jacobian=options.jacobian;
			this.Step=this.StepAnalytic;
		}else
		{
			this.Step=this.StepNumeric;
		}
		this.jacobianConst=(options.jacobianConst==true?true:false);
		var count=this.funcs.length;
		this.jacobian_m=new Array(count*count);
	}
	StepAnalytic(data,complexity)
	{
		var count=data.xv.length;
		var max_iteration=10;
		var f=new Array(count);
		var y=data.xv.slice();
		var t_next=data.t+this.step;
		var y_old=data.xv.slice();
		var k=0;
		var last_f_difference=Number.MAX_VALUE;
		if(this.jacobianConst==true)
		{
			for(var j=0;j<count;j++)
			{
				for(var i=0;i<count;i++)
				{	
					var df=-this.step*this.jacobian[i+j*count](y,t_next);
					if(i==j)
						df+=1.0;
					this.jacobian_m[i+j*count]=df;
				}
			}
		}
		for(var i=0;i<count;i++)
		{
			f[i]=-this.BIGF(y_old[i],y[i],this.step,this.funcs[i],t_next,y);
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
						var df=-this.step*this.jacobian[i+j*count](y,t_next);
						if(i==j)
							df+=1.0;
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
				f[i]=-this.BIGF(y_old[i],y[i],this.step,this.funcs[i],t_next,y);
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
			if(f_difference<0.001)
			{
				break;
			}
			else if(k>=max_iteration)
			{	
				break;//return xv
			}
			else if(y_difference<0.001)
			{
				break;
			}
		}
		complexity.rightSideEvaluation+=(k+1)*count;
		complexity.matrixSolving+=k;
		complexity.currentStep=this.step;
		complexity.averageStep+=this.step;
		if(this.jacobianConst!=true)
			complexity.rightSideEvaluation+=count*count*k;
		else
			complexity.rightSideEvaluation+=count*count;
		data.t+=this.step;
		return;
	}
	StepNumeric(data,complexity)
	{
		var count=data.xv.length;
		var max_iteration=10;
		var f=new Array(count);
		var y=data.xv.slice();
		var t_next=data.t+this.step;
		var y_old=data.xv.slice();
		var jacobianStep=0.001;
		var k=0;
		var last_f_difference=Number.MAX_VALUE;
		if(this.jacobianConst==true)
		{
			for(var j=0;j<count;j++)
			{
				for(var i=0;i<count;i++)
				{//df=y+jstep-h*f(t,y+jstep)-y+h*f(t,y)
					var y_temp=y[i];
					var df=(-this.funcs[j](y,t_next));
					y[i]+=this.jacobianStep;
					df=(-this.funcs[j](y,t_next)-df);
					df*=this.step;
					df/=jacobianStep;
					if(i==j)
						df+=1.0;
					this.jacobian_m[i+j*count]=df;
					y[i]=y_temp;
				}
			}
		}
		for(var i=0;i<count;i++)
		{
			f[i]=(-this.BIGF(y_old[i],y[i],this.step,this.funcs[i],t_next,y));
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
						var df=(-this.funcs[j](y,t_next));
						y[i]+=jacobianStep;
						df=(-this.funcs[j](y,t_next)-df);
						df*=this.step;
						df/=jacobianStep;
						if(i==j)
							df+=1.0;
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
				f[i]=(-this.BIGF(y_old[i],y[i],this.step,this.funcs[i],t_next,y));
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
			if(f_difference<0.001)
			{
				break;
			}
			else if(k>=max_iteration)
			{	
				break;//return xv
			}
			if(y_difference<0.001)
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
}
ImplicitEuler.attributes={name:'Неявный метод Эйлера'};
ImplicitEuler.options=['jacobianMatrixEnabled'];

export default ImplicitEuler;