import ImplicitRungeKuttaGeneral from "./ImplicitRungeKuttaGeneral.js";

class ImplicitRadauIA5 extends ImplicitRungeKuttaGeneral
{
	constructor()
	{
		super();
		{
			let root6=Math.sqrt(6);
			this.a_m=[1/9,(-1-root6)/18,(-1+root6)/18,
			1/9,(88+7*root6)/360,(88-43*root6)/360,
			1/9,(88+43*root6)/360,(80-7*root6)/360];//row order
			this.b_v=[1/9,(16+root6)/36,(16-root6)/36];
			this.c_v=[0,(6-root6)/10,(6+root6)/10];
		}
		this.k_order=3;
	}
}

ImplicitRadauIA5.attributes={name:'Метод Radau IA 5 порядка'};
ImplicitRadauIA5.options=['jacobianMatrixEnabled'];

export default ImplicitRadauIA5;
/*
import gaussSolve from "../gauss.js";

class ImplicitRadauI5
{
	constructor()
	{
			this.step=0;
			this.funcs;
			this.jacobianConst=false;
			this.jacobian=null;
			this.jacobian_m;
			this.a_m;
			this.c_v;
			this.b_v;
			{
				let root6=Math.sqrt(6);
				this.a_m=[1/9,(-1-root6)/18,(-1+root6)/18,
				1/9,(88+7*root6)/360,(88-43*root6)/360,
				1/9,(88+43*root6)/360,(80-7*root6)/360];//row order
				this.b_v=[1/9,(16+root6)/36,(16-root6)/36];
				this.c_v=[0,(6-root6)/10,(6+root6)/10];
			}
			this.methodOptions={
				f_abs_error:0.001,
				max_newton_iterations:5,
				min_newton_abs_change:0.01,
				min_newton_rel_change:0.1,
				k_abs_error:0.001
			};
			this.k_order=3;
			this.max_iteration=10;
	}
	BIGF(k_s,y_h_a_k_sum_v,t_s,func_s)//s for scalar, v for vector
	{	
		var t=k_s-func_s(y_h_a_k_sum_v,t_s);
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
		this.jacobian_m=new Array(this.k_order*this.k_order*count*count);
	}
	StepNumeric(data,complexity)
	{
		var count=data.xv.length;
		var f=new Array(this.k_order*count);
		var y=data.xv.slice();
		var y_old=data.xv.slice();
		var k=0;
		var last_f_difference=Number.MAX_VALUE;
		var k_difference=Number.MAX_VALUE;
		var k_v=new Array(this.k_order*count);
		for(var i=0;i<k_v.length;i++)
			k_v[i]=0;
		var ktemp=new Array(this.k_order);
		var jacobianStep=0.001;
		for(var i=0;i<this.k_order;i++)
		{
			ktemp[i]=new Array(count);
		}
		var t_v=new Array(this.k_order);
		for(var i=0;i<this.k_order;i++)
		{
			t_v[i]=data.t+this.step*this.c_v[i];
		}
			

		for(var j=0,mn=0;j<this.k_order;j++)
		{
			var a_row_number=j*this.k_order;
			for(var i=0;i<count;i++)
			{
				var temp=0;
				for(var l=0,v=i;l<this.k_order;l++,v+=count)
				{
					temp+=this.a_m[a_row_number+l]*k_v[v];
				}
				ktemp[j][i]=y_old[i]+temp*this.step;
			}
			for(var i=0;i<count;i++,mn++)
			{
				f[mn]=(-this.BIGF(k_v[mn],ktemp[j],t_v[j],this.funcs[i]))
				last_f_difference=Math.max(last_f_difference,Math.abs(f[mn]));
			}
		}

		if(this.jacobianConst==true)
		{
			for(var p=0,z=0,it=0;p<this.k_order;p++)
			{
				for(var j=0;j<count;j++,it++)
				{
					for(var l=0,m=0;l<this.k_order;l++)
					{	
						for(var i=0;i<count;i++,m++,z++)
						{
							var k_temp=ktemp[p][i];
							var df=(-this.funcs[j](ktemp[p],t_v[p]));
							ktemp[p][i]+=jacobianStep*this.a_m[p*this.k_order+l]*this.step;
							df=(-this.funcs[j](y,data.t+this.step)-df); 
							df/=jacobianStep;
							if(m==it)
								df+=1.0;
							this.jacobian_m[z]=df;
							ktemp[p][i]=k_temp;
						}
					}
				}
			}
		}

		while(true)
		{
			
			//solve system J(y_new(i))(dy)=-F(y_new(i))
			//y_new(0)=y_old
			var dk;
			if(this.jacobianConst==true)
			{
				var jacobian_t=this.jacobian_m.slice();
				dk=gaussSolve(jacobian_t,f);
			}
			else
			{
				{for(var p=0,z=0,it=0;p<this.k_order;p++)
					for(var j=0;j<count;j++,it++)
					{
						for(var l=0,m=0;l<this.k_order;l++)
						{	for(var i=0;i<count;i++,m++,z++)
							{
								var k_temp=ktemp[p][i];
								var df=(-this.funcs[j](ktemp[p],t_v[p]));
								ktemp[p][i]+=jacobianStep*this.a_m[p*this.k_order+l]*this.step;
								df=(-this.funcs[j](ktemp[p],t_v[p])-df); 
								df/=jacobianStep;
								if(m==it)
									df+=1.0;
								this.jacobian_m[z]=df;
								ktemp[p][i]=k_temp;
							}
						}
					}
				}
				dk=gaussSolve(this.jacobian_m,f);
			}
			k_difference=0;//max norm for dy
			for(var i=0;i<count;i++)
			{
				var temp=0;
				for(var j=0;j<this.k_order;j++)
				{
					var p=j*count+i;
					k_difference=Math.max(Math.abs(dk[p]),k_difference);
					k_v[p]+=dk[p];
					temp+=k_v[p]*this.b_v[j];
				}
				y[i]=y_old[i]+temp*this.step;
			}
			k++;
			var f_difference=0;
			for(var j=0,mn=0;j<this.k_order;j++)
			{
				var a_row_number=j*this.k_order;
				for(var i=0;i<count;i++)
				{
					var temp=0;
					for(var l=0,v=i;l<this.k_order;l++,v+=count)
					{
						temp+=this.a_m[a_row_number+l]*k_v[v];
					}
					ktemp[j][i]=y_old[i]+temp*this.step;
				}
				for(var i=0;i<count;i++,mn++)
				{
					f[mn]=(-this.BIGF(k_v[mn],ktemp[j],t_v[j],this.funcs[i]))
					f_difference=Math.max(f_difference,Math.abs(f[mn]));
				}
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
			else if(k_difference<0.001)
			{
				break;
			}
			else if(k>=this.max_iteration)
			{	
				break;//return xv
			}
		}
		if(this.jacobianConst!=true)
			complexity.rightSideEvaluation+=count*count*2*this.k_order*this.k_order*k;
		else
			complexity.rightSideEvaluation+=count*count*2*this.k_order*this.k_order;
		complexity.matrixSolving+=k;
		complexity.rightSideEvaluation+=(k+1)*count;
		complexity.currentStep=this.step;
		complexity.averageStep+=this.step;
		data.t+=this.step;
		return;
	}
	StepAnalytic(data,complexity)
	{
		var count=data.xv.length;
		var f=new Array(this.k_order*count);
		var y=data.xv.slice();
		var y_old=data.xv.slice();
		var k=0;
		var k_v=new Array(this.k_order*count);
		for(var i=0;i<k_v.length;i++)
			k_v[i]=0;
		var ktemp=new Array(this.k_order);
		for(var i=0;i<this.k_order;i++)
		{
			ktemp[i]=new Array(count);
		}
		var t_v=new Array(this.k_order);
		for(var i=0;i<this.k_order;i++)
		{
			t_v[i]=data.t+this.step*this.c_v[i];
		}
		var last_f_difference=Number.MAX_VALUE;
		var k_difference=Number.MAX_VALUE;
		var f_difference=0;//max norm for F(y_old+dy)
			

		for(var j=0,mn=0;j<this.k_order;j++)
			{
				var a_row_number=j*this.k_order;
				for(var i=0;i<count;i++)
				{
					var temp=0;
					for(var l=0,v=i;l<this.k_order;l++,v+=count)
					{
						temp+=this.a_m[a_row_number+l]*k_v[v];
					}
					ktemp[j][i]=y_old[i]+temp*this.step;
				}
				for(var i=0;i<count;i++,mn++)
				{
					f[mn]=(-this.BIGF(k_v[mn],ktemp[j],t_v[j],this.funcs[i]))
					last_f_difference=Math.max(last_f_difference,Math.abs(f[mn]));
				}
			}

		if(this.jacobianConst==true)
		{
			for(var p=0,z=0,it=0;p<this.k_order;p++)
				for(var j=0;j<count;j++,it++)
				{
					for(var l=0,m=0;l<this.k_order;l++)
					{	for(var i=0;i<count;i++,m++,z++)
						{
							var df=-this.jacobian[j*count+i](ktemp[p],t_v[p])*this.a_m[p*this.k_order+l]*this.step;
							if(m==it)
								df+=1.0;
							this.jacobian_m[z]=df;
						}
					}
				}	
		}
			
		while(true)
		{
			
			//solve system J(y_new(i))(dy)=-F(y_new(i))
			//y_new(0)=y_old
			var dk;
			if(this.jacobianConst==true)
			{
				var jacobian_t=this.jacobian_m.slice();
				dk=gaussSolve(jacobian_t,f);
			}else
			{
				for(var p=0,z=0,it=0;p<this.k_order;p++)
					for(var j=0;j<count;j++,it++)
					{
						for(var l=0,m=0;l<this.k_order;l++)
						{	for(var i=0;i<count;i++,m++,z++)
							{
								var df=-this.jacobian[j*count+i](ktemp[p],t_v[p])*this.a_m[p*this.k_order+l]*this.step;
								if(m==it)
									df+=1.0;
								this.jacobian_m[z]=df;
							}
						}
					}
				dk=gaussSolve(this.jacobian_m,f);
			}
			k_difference=0;//max norm for dy
			for(var i=0;i<count;i++)
			{
				var temp=0;
				for(var j=0;j<this.k_order;j++)
				{
					var p=j*count+i;
					k_difference=Math.max(Math.abs(dk[p]),k_difference);
					k_v[p]+=dk[p];
					temp+=k_v[p]*this.b_v[j];
				}
				y[i]=y_old[i]+temp*this.step;
			}

			var f_difference=0;
			for(var j=0,mn=0;j<this.k_order;j++)
			{
				var a_row_number=j*this.k_order;
				for(var i=0;i<count;i++)
				{
					var temp=0;
					for(var l=0,v=i;l<this.k_order;l++,v+=count)
					{
						temp+=this.a_m[a_row_number+l]*k_v[v];
					}
					ktemp[j][i]=y_old[i]+temp*this.step;
				}
				for(var i=0;i<count;i++,mn++)
				{
					f[mn]=(-this.BIGF(k_v[mn],ktemp[j],t_v[j],this.funcs[i]))
					f_difference=Math.max(f_difference,Math.abs(f[mn]));
				}
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
			if(k>=this.max_iteration)
			{	
				break;//return xv
			}
			if(k_difference<0.001)
			{
				break;
			}
		}
		complexity.rightSideEvaluation+=(k+1)*count;
		complexity.matrixSolving+=k;
		complexity.currentStep=this.step;
		complexity.averageStep+=this.step;
		if(this.jacobianConst!=true)
			complexity.rightSideEvaluation+=count*count*this.k_order*this.k_order*k;
		else
			complexity.rightSideEvaluation+=count*count*this.k_order*this.k_order;
		data.t+=this.step;
		return;
	}
}*/