
//general
Ralston=(function(){

	function Step(xv,t,delta,funcs)
	{
		var count=xv.length;
		var k1=new Array(count);
		var k2=new Array(count);
		var ktemp=new Array(count);
		for(var i=0;i<count;i++)
		{
			k1[i]=funcs[i](xv,t)*delta;
			ktemp[i]=k1[i]*0.666667+xv[i];
		}
		var t_next=t+delta*0.666667;
		for(var i=0;i<count;i++)
		{
				//k2 = h f(xi + 2 h / 3, yi + 2 k1 / 3 )
				k2[i]=funcs[i](ktemp,t_next)*delta;
			}
			for(var i=0;i<count;i++)
				xv[i]+=k1[i]*0.25+0.75*k2[i];
		}
		return {Step:Step,attributes:{name:'Ralston'}};
	})();

ExplicitTrapezoidal=(function()//y(i,n+1)=y(i,n)+dt/2*(f(t,y(n))+f(t+dt,y(n+1')))
{
		/*
		y(n+1)=y(n)*0.5+y(n+1')*0.5+h*0.5*f(t+dt,y(n+1'))

		*/
		function Step(xv,t,delta,funcs)
		{
			var count=xv.length;
			var k=new Array(count);
			var temp=new Array(count);
			for(var i=0;i<count;i++)
			{
				temp[i]=xv[i]+funcs[i](xv,t)*delta;
			}
			var t_next=t+delta;
			for(var i=0;i<count;i++)
			{
				//k[i]=delta*0.5*(funcs[i](t,xv)+funcs[i](t_next,t));
				xv[i]=(funcs[i](temp,t_next)*delta+temp[i]+xv[i])*0.5;
			}
		}
		return {Step:Step,attributes:{name:'Explicit Trapezoidal'}};
	})();
ImplicitTrapezoidal=(function(){//∂F(i)/∂y(s+1,j)=δ(i,j)-0.5*h*∂f(t+h,y(s+1,j))/∂y(s+1,j))
	function StepFunkJ(xv,t,step,funcs,jacobian)
	{
		var count=xv.length;
		var max_iteration=20;
		var f=new Array(count);
		var y=xv.slice();
		var t_next=t+step;
		var y_old=xv.slice();
		var jacobianm=new Array(count*count);
		dx=new Array(count);
		var k=0;
		var last_f_difference=Number.MAX_VALUE;
		while(true)
		{
					var f_difference=0;//max norm for F(y_old+dy)
					for(var i=0;i<count;i++)
					{
						f[i]=-BIGF(y_old[i],y[i],step,funcs[i],t_next,y,func_y_old[i]);
						f_difference=Math.max(f_difference,Math.abs(f[i]));
					}
					if(last_f_difference>=f_difference)
					{
						for(var i=0;i<count;i++)//remember last optimal solution
						{
							xv[i]=y[i];
						}
						last_f_difference=f_difference;
					}
					if(f_difference<0.01)
					{
						return;
					}
					if(k>=max_iteration)
					{	
						return;//return xv
					}
					//solve system J(y_new(i))(dy)=-F(y_new(i))
					//y_new(0)=y_old
					for(var j=0;j<count;j++)
					{
						for(var i=0;i<count;i++)
						{	
							var df=0.5*step*jacobian[i+j*count](y,t_next);
							if(i==j)
								df+=1.0;
							jacobian_m[i+j*count]=df;
						}
					}
					var dy=gaussSolve(jacobian,f);
					y_difference=0;//max norm for dy
					for(var i=0;i<count;i++)
					{
						y_difference=Math.max(dy[i],y_difference);
						y[i]=dy[i];
					}
					if(dy<0.01)
					{
						return;
					}
					k++;
				}
				return;

			}
			function StepConstJ(xv,t,step,funcs,jacobian)
			{
				var count=xv.length;
				var max_iteration=20;
				var f=new Array(count);
				var y=xv.slice();
				var t_next=t+step;
				var y_old=xv.slice();
				function BIGF(y_old_s,y_new_s,step,func_s,t_next,y_new_v,func_s_y_old)//s for scalar, v for vector
				//F(y(s+1))=y(s+1)-y(s)-h*f(t(s+1),y(s+1))
				{	
					var t=y_new_s-y_old_s-0.5*step*(func_s(y_new_v,t_next)+func_s_y_old);
					return t;
				}
				var func_y_old=new Array(count);
				for(var i=0;i<count;i++)
				{
					func_y_old[i]=funcs[i](y_old,t);
				}
				var jacobian_m;
				var jacobian_t=new Array(count*count);
				for(var j=0;j<count;j++)
				{
					for(var i=0;i<count;i++)
					{
						if(i==j)
							jacobian_t[i+j*count]=1.0-0.5*step*jacobian[i+j*count];
						else
							jacobian_t[i+j*count]=-0.5*step*jacobian[i+j*count];
					}
				}
				dx=new Array(count);
				var k=0;
				var last_f_difference=Number.MAX_VALUE;
				while(true)
				{
							var f_difference=0;//max norm for F(y_old+dy)
							for(var i=0;i<count;i++)
							{
								f[i]=-BIGF(y_old[i],y[i],step,funcs[i],t_next,y,func_y_old[i]);
								f_difference=Math.max(f_difference,Math.abs(f[i]));
							}
							if(last_f_difference>=f_difference)
							{
								for(var i=0;i<count;i++)//remember last optimal solution
								{
									xv[i]=y[i];
								}
								last_f_difference=f_difference;
							}
							if(f_difference<0.01)
							{
								return;
							}
							if(k>=max_iteration)
							{	
								return;//return xv
							}
							//solve system J(y_new(i))(dy)=-F(y_new(i))
							//y_new(0)=y_old
							jacobian_m=jacobian_t.slice();
							var dy=gaussSolve(jacobian_m,f);
							y_difference=0;//max norm for dy
							for(var i=0;i<count;i++)
							{
								y_difference=Math.max(dy[i],y_difference);
								y[i]+=dy[i];
							}
							if(dy<0.01)
							{
								return;
							}
							k++;
						}
						return;

					}

					function Step(xv,t,step,funcs,options)
					{
						if(options!==undefined)
						{
							if(options.hasOwnProperty('jacobian'))
							{
								if(typeof options.jacobian[0] === "function")
								{
									return StepFuncJ(xv,t,step,funcs,options.jacobian);
								}else
								{
									return StepConstJ(xv,t,step,funcs,options.jacobian);
								}
							}
						}		
						var count=xv.length;
						var max_iteration=20;
						var f=new Array(count);
						var y=xv.slice();
						var t_next=t+step;
						var y_old=xv.slice();
		function BIGF(y_old_s,y_new_s,step,func_s,t_next,y_new_v,func_s_y_old)//s for scalar, v for vector
		//F(y(s+1))=y(s+1)-y(s)-h*f(t(s+1),y(s+1))
		{	
			var t=y_new_s-y_old_s-0.5*step*(func_s(y_new_v,t_next)+func_s_y_old);
			return t;
		}
		var func_y_old=new Array(count);
		for(var i=0;i<count;i++)
		{
			func_y_old[i]=funcs[i](y_old,t);
		}
		var jacobianStep=0.001;


		var jacobian=new Array(count*count);
		var k=0;
		var last_f_difference=Number.MAX_VALUE;
		while(true)
		{
					var f_difference=0;//max norm for F(y_old+dy)
					for(var i=0;i<count;i++)
					{
						f[i]=(-BIGF(y_old[i],y[i],step,funcs[i],t_next,y,func_y_old[i]));
						f_difference=Math.max(f_difference,Math.abs(f[i]));
					}
					if(last_f_difference>=f_difference)
					{
						for(var i=0;i<count;i++)//remember last optimal solution
						{
							xv[i]=y[i];
						}
						last_f_difference=f_difference;
					}
					if(f_difference<0.001)
					{
						return;
					}
					if(k>=max_iteration)
					{	
						return;//return xv
					}
					//solve system J(y_new(i))(dy)=-F(y_new(i))
					//y_new(0)=y_old
					for(var j=0;j<count;j++)
					{
						for(var i=0;i<count;i++)
						{//df=y+jstep-h*f(t,y+jstep)-y+h*f(t,y)
							var y_temp=y[i];
							var df=(-funcs[j](y,t_next));
							y[i]+=jacobianStep;
							df=(-funcs[j](y,t_next)-df);
							df*=step*0.5;
							df/=jacobianStep;
							if(i==j)
								df+=1.0;
							jacobian[i+j*count]=df;
							y[i]=y_temp;
						}
					}
					var dy=gaussSolve(jacobian,f);
					y_difference=0;//max norm for dy
					for(var i=0;i<count;i++)
					{
						y_difference=Math.max(Math.abs(dy[i]),y_difference);
						y[i]+=dy[i];
					}
					if(y_difference<0.001)
					{
						return;
					}
					k++;
				}
				return;
			}
			return {Step:Step,attributes:{name:'Implicit Trapezoidal'},options:['useJacobian']};
		})();

ExplicitEulerSystem=(function()//y(i,n+1)=y(i,n)+dt*f(t,y(n))
{
	function Step(xv,t,delta,funcs)
	{
		var count=xv.length;
		var k=new Array(count);
		for(var i=0;i<count;i++)
		{
			k[i]=delta*funcs[i](xv,t);
		}
		for(var i=0;i<count;i++)
			xv[i]+=k[i];
	}
	function AutoStep(xv,t,delta,delta_min,delta_max,funcs,error)
	{
		var count=xv.length;
		if(delta_min==delta_max)
		{
			var k=new Array(count);
			for(var i=0;i<count;i++)
			{
				k[i]=delta*funcs[i](xv,t);
			}
			for(var i=0;i<count;i++)
				xv[i]+=k[i];
			return delta;
		}else{
			var k=new Array(count);
			for(var i=0;i<count;i++)
			{
				k[i]=delta*funcs[i](xv,t);
			}
			for(var i=0;i<count;i++)
				k[i]+=xv[i];

			var d2=delta*0.5;
			var xv_temp=new Array(count);
			var k2=new Array(count);
			for(var i=0;i<count;i++)
			{
				k2[i]=d2*funcs[i](xv,t);
			}
			for(var i=0;i<count;i++)
				xv_temp[i]=xv[i]+k2[i];
			for(var i=0;i<count;i++)
			{
				k2[i]=xv[i]+d2*funcs[i](xv_temp,t+d2);
			}
			var difference=0;
			for(var i=0;i<count;i++)
			{
				var t=k2[i]-k[i];
				difference+=(t*t);
			}
			difference=Math.sqrt(difference);
			var delta_calc=0.9*error/difference*delta;
			delta=Math.min(Math.max(delta_min,delta),delta_max);
				if(delta<d2)//если шаг меньше половины иходного, посчитать заново
				{
					Step(xv,t,delta,funcs);
				}
				return delta;
			}
		}
		return {Step:Step,attributes:{name:'Explicit Euler'}};
	})();

ImplicitEulerSystem=(function()//FixedPointIteration
{
	function Step(xv,t,delta,funcs)
	{
		var count=xv.length;
		var k=new Array(count);
		for(var i=0;i<count;i++)
		{
			k[i]=xv[i]+delta*funcs[i](xv,t);
		}
		for(var i=0;i<count;i++)
		{
			xv[i]=xv[i]+delta*funcs[i](k,t);
		}
	}
	return {Step:Step,attributes:{name:'Implicit Euler fxd pnt'}};
})();

MidpointSystem=(function()//y(i,n+1)=y(i,n)+dt*f(t+dt*0.5,(y(n)+y(n+1))*0.5)
{
	function Step(xv,t,delta,funcs)
	{
		var count=xv.length;
		var k=new Array(count);
		t_average=t+delta*0.5;
		var temp=new Array(count);
		for(var i=0;i<count;i++)
		{
			temp[i]=(xv[i]+funcs[i](xv,t)*delta*0.5);
		}
		for(var i=0;i<count;i++)
		{
			k[i]=delta*funcs[i](temp,t_average);
		}
		for(var i=0;i<count;i++)
			xv[i]+=k[i];
	}
	return {Step:Step,attributes:{name:'Explicit Midpoint'}};
})();
/*
http://www.math.ubc.ca/~feldman/math/vble.pdf
http://www.math.ubc.ca/~feldman/math/richard.pdf
http://www.math.ubc.ca/~feldman/demos/demo4.html
http://www.math.ubc.ca/~feldman/math/ode.html
https://www.wias-berlin.de/people/john/LEHRE/NUMERIK_II/ode_1.pdf
http://www.aip.de/groups/soe/local/numres/bookcpdf/c16-2.pdf
*/

RK4System=(function()
{
	function Step(xv,t,delta,funcs)
	{
		var count=xv.length;
		var k=new Array(4*count);
		var ktemp=new Array(count);
		for(var i=0;i<count;i++)
		{
			k[i]=delta*funcs[i](xv,t);
			ktemp[i]=xv[i]+k[i]*0.5;
		}
		for(var i=0;i<count;i++)
		{
			k[count+i]=delta*funcs[i](ktemp,t+delta*0.5);
		}
		for(var i=0;i<count;i++)
		{
			ktemp[i] = xv[i] + k[count + i] * 0.5;
		}
		var count2 = count +count;
		for (var i = 0; i < count; i++)
		{	
			k[count2 + i] = delta*funcs[i](ktemp, t + delta*0.5);
		}
		for(var i=0;i<count;i++)
		{
			ktemp[i] = xv[i] + k[count2 + i];
		}
		var count3 = count + count2;
		for (var i = 0; i < count; i++)
			k[count3 + i] = delta*funcs[i](ktemp, t + delta);
		var koeff = 1.0 / 6.0;
		for (var i = 0; i < count; i++)
			xv[i] += koeff*(k[i] + 2.*(k[i + count] + k[i + count2]) + k[i + count3]);
	}

	return {Step:Step,attributes:{name:'Runge Kutta 4'}};
})();


DormandPrice=(function(){

	var a=[1/5,
	3/40,9/40,
	44/45,-56/15, 32/9,
	19372/6561,-25360/2187, 64448/6561,-212/729,
	9017/3168,-355/33, 46732/5247,49/176,-5103/18656,
	35/384,0,500/1113,125/192,-2187/6784,11/84
	];
	var b1=[35/384,0,500/1113,125/192,-2187/6784,11/84];
	var b2=[5179/57600,0,7571/16695,393/640,-92097/339200,187/2100,1/40];
	var c=[0,1/5,3/10,4/5,8/9,1,1];
	var kdiff=[71/57600,-71/16695,71/1920,-17253/339200,22/525,1/40];
		function Step(xv,t,stepmin,step,stepmax,funcs,errorTolerance)//http://www2.imm.dtu.dk/pubdb/views/edoc_download.php/6607/pdf/imm6607.pdf
	//http://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.408.7247&rep=rep1&type=pdf
	{
		var count=xv.length;
		var k=new Array(7);
		for(var i=0;i<7;i++)
		{
			k[i]=new Array(count);
		}
		var ktemp=xv.slice();
		var aIterator=0;
		var t_i;
		for(var i=0;i<6;i++)
		{
			t_i=t+c[i]*step;
			for(var j=0;j<count;j++)
				k[i][j]=funcs[i](ktemp,t_i);
			for(var j=0;j<count;j++)
			{
				for(var l=0;l<=i;l++)
				{
					temp+=a[aIterator]*k[l];
					aIterator++;
				}
				ktemp[j]=temp*step+xv[j];;
			}
		}
		t_i=t+c[6]*step;
		for(var j=0;j<count;j++)
			k[6][j]=funcs[i](ktemp,t_i)
		var difference=0;
		for(var j=0;j<count;j++)//find max norm |x|=max(x(j)), j=1,n
		{	
			var tempDifference=0;
			for(var i=0;i<7;i++)
			{
				tempDifference+=kdiff[i]*k[i][j];
			}
			tempDifference=Math.abs(tempDifference);
			difference=Math.max(difference,tempDifference);
		}
		var stepOpt=Math.pow(errorTolerance*step*0.5/difference,0.20)*step;
		stepOpt=Math.min(Math.max(stepmin,stepOpt),stepmax);
		if(stepOpt>step)
		{
			//пусть пока будет так

		}else
		{
			for(var i=0;i<6;i++)
			{
				for(var j=0;j<count;j++)
					xv[j]+=k[i][j]*b1[i];
			}
		}
		return stepOpt;
	}
	return {Step:Step,attributes:{name:'Dormand Price'},options:['autoStep']};
})();

	//http://www.unige.ch/~hairer/preprints/coimbra.pdf

//http://web.mit.edu/16.90/BackUp/www/pdfs/ChapterJ.pdf where j is number - mit numerical methods course
ImplicitEulerJacobian=(function()//done
{
	function StepConstJ(xv,t,step,funcs,jacobian)
	{
		var count=xv.length;
		var max_iteration=20;
		var f=new Array(count);
		var y=xv.slice();
		var t_next=t+step;
		var y_old=xv.slice();
		function BIGF(y_old_s,y_new_s,step,func_s,t_next,y_new_v)//s for scalar, v for vector
		//F(y(s+1))=y(s+1)-y(s)-h*f(t(s+1),y(s+1))
		{	
			var t=y_new_s-y_old_s-step*func_s(y_new_v,t_next);
			return t;
		}
		var jacobian_m;
		var jacobian_t=new Array(count*count);
		for(var j=0;j<count;j++)
		{
			for(var i=0;i<count;i++)
			{
				if(i==j)
					jacobian_t[i+j*count]=1.0-step*jacobian[i+j*count];
				else
					jacobian_t[i+j*count]=-step*jacobian[i+j*count];
			}
		}
		dx=new Array(count);
		var k=0;
		var last_f_difference=Number.MAX_VALUE;
		while(true)
		{
					var f_difference=0;//max norm for F(y_old+dy)
					for(var i=0;i<count;i++)
					{
						f[i]=-BIGF(y_old[i],y[i],step,funcs[i],t_next,y);
						f_difference=Math.max(f_difference,Math.abs(f[i]));
					}
					if(last_f_difference>=f_difference)
					{
						for(var i=0;i<count;i++)//remember last optimal solution
						{
							xv[i]=y[i];
						}
						last_f_difference=f_difference;
					}
					if(f_difference<0.01)
					{
						return;
					}
					if(k>=max_iteration)
					{	
						return;//return xv
					}
					//solve system J(y_new(i))(dy)=-F(y_new(i))
					//y_new(0)=y_old
					jacobian_m=jacobian_t.slice();
					var dy=gaussSolve(jacobian_m,f);
					y_difference=0;//max norm for dy
					for(var i=0;i<count;i++)
					{
						y_difference=Math.max(dy[i],y_difference);
						y[i]+=dy[i];
					}
					if(dy<0.01)
					{
						return;
					}
					k++;
				}
				return;

			}
			function StepFuncJ(xv,t,step,funcs,jacobian)
			{
				var count=xv.length;
				var max_iteration=20;
				var f=new Array(count);
				var y=xv.slice();
				var t_next=t+step;
				var y_old=xv.slice();

		function BIGF(y_old_s,y_new_s,step,func_s,t_next,y_new_v)//s for scalar, v for vector
		//F(y(s+1))=y(s+1)-y(s)-h*f(t(s+1),y(s+1))
		{	
			var t=y_new_s-y_old_s-step*func_s(y_new_v,t_next);
			return t;
		}


		var jacobian_m=new Array(count*count);
		dx=new Array(count);
		var k=0;
		var last_f_difference=Number.MAX_VALUE;
		while(true)
		{
					var f_difference=0;//max norm for F(y_old+dy)
					for(var i=0;i<count;i++)
					{
						f[i]=-BIGF(y_old[i],y[i],step,funcs[i],t_next,y);
						f_difference=Math.max(f_difference,Math.abs(f[i]));
					}
					if(last_f_difference>=f_difference)
					{
						for(var i=0;i<count;i++)//remember last optimal solution
						{
							xv[i]=y[i];
						}
						last_f_difference=f_difference;
					}
					if(f_difference<0.01)
					{
						return;
					}
					if(k>=max_iteration)
					{	
						return;//return xv
					}
					//solve system J(y_new(i))(dy)=-F(y_new(i))
					//y_new(0)=y_old
					for(var j=0;j<count;j++)
					{
						for(var i=0;i<count;i++)
						{	
							var df=step*jacobian[i+j*count](y,t_next);
							if(i==j)
								df+=1.0;
							jacobian_m[i+j*count]=df;
						}
					}
					var dy=gaussSolve(jacobian_m,f);
					y_difference=0;//max norm for dy
					for(var i=0;i<count;i++)
					{
						y_difference=Math.max(dy[i],y_difference);
						y[i]=dy[i];
					}
					if(dy<0.01)
					{
						return;
					}
					k++;
				}
				return;
			}




			function Step(xv,t,step,funcs,options)
			{	
				if(options!==undefined)
				{
					if(options.hasOwnProperty('jacobian'))
					{
						if(typeof options.jacobian[0] === "function")
						{
							return StepFuncJ(xv,t,step,funcs,options.jacobian);
						}else
						{
							return StepConstJ(xv,t,step,funcs,options.jacobian);
						}
					}
				}
				var count=xv.length;
				var max_iteration=20;
				var f=new Array(count);
				var y=xv.slice();
				var t_next=t+step;
				var y_old=xv.slice();
		function BIGF(y_old_s,y_new_s,step,func_s,t_next,y_new_v)//s for scalar, v for vector
		//F(y(s+1))=y(s+1)-y(s)-h*f(t(s+1),y(s+1))
		{	
			var t=y_new_s-y_old_s-step*func_s(y_new_v,t_next);
			return t;
		}
		var jacobianStep=0.001;


		var jacobian=new Array(count*count);
		var k=0;
		var last_f_difference=Number.MAX_VALUE;
		while(true)
		{
					var f_difference=0;//max norm for F(y_old+dy)
					for(var i=0;i<count;i++)
					{
						f[i]=(-BIGF(y_old[i],y[i],step,funcs[i],t_next,y));
						f_difference=Math.max(f_difference,Math.abs(f[i]));
					}
					if(last_f_difference>=f_difference)
					{
						for(var i=0;i<count;i++)//remember last optimal solution
						{
							xv[i]=y[i];
						}
						last_f_difference=f_difference;
					}
					if(f_difference<0.001)
					{
						return;
					}
					if(k>=max_iteration)
					{	
						return;//return xv
					}
					//solve system J(y_new(i))(dy)=-F(y_new(i))
					//y_new(0)=y_old
					for(var j=0;j<count;j++)
					{
						for(var i=0;i<count;i++)
						{//df=y+jstep-h*f(t,y+jstep)-y+h*f(t,y)
							var y_temp=y[i];
							var df=(-funcs[j](y,t_next));
							y[i]+=jacobianStep;
							df=(-funcs[j](y,t_next)-df);
							df*=step;
							df/=jacobianStep;
							if(i==j)
								df+=1.0;
							jacobian[i+j*count]=df;
							y[i]=y_temp;
						}
					}
					var dy=gaussSolve(jacobian,f);
					y_difference=0;//max norm for dy
					for(var i=0;i<count;i++)
					{
						y_difference=Math.max(Math.abs(dy[i]),y_difference);
						y[i]+=dy[i];
					}
					if(y_difference<0.001)
					{
						return;
					}
					k++;
				}
				return;
			}
			return {Step:Step,attributes:{name:'Implicit Euler'},options:['useJacobian']};
		})();

ImplicitMidpoint=(function(){//∂F(i)/∂y(s+1,j)=δ(i,j)-0.5*h*∂f(t+h*0.5,0.5*(y(s)+y(s+1,j)))/∂y(s+1,j))   why?   because chain rule
	
	function StepFuncJ(xv,t,step,funcs,jacobian)
	{
		var count=xv.length;
		var max_iteration=20;
		var f=new Array(count);
		var y=xv.slice();
		var t_next=t+step*0.5;
		var y_old=xv.slice();
		function BIGF(y_old_s,y_new_s,step,func_s,t_next,y_old_new_v)//s for scalar, v for vector
		//F(y(s+1))=y(s+1)-y(s)-h*f(t(s+1),y(s+1))
		{	
			var t=y_new_s-y_old_s-step*(func_s(y_old_new_v,t_next));//y_old_new_v = 0.5(y(s)+y(s+1,j))
			return t;
		}
		var jacobian_m=new Array(count*count);
		dx=new Array(count);
		var k=0;
		var last_f_difference=Number.MAX_VALUE;
		while(true)
		{
					var f_difference=0;//max norm for F(y_old+dy)
					for(var i=0;i<count;i++)
					{
						f[i]=-BIGF(y_old[i],y[i],step,funcs[i],t_next,y_old_new);
						f_difference=Math.max(f_difference,Math.abs(f[i]));
					}
					if(last_f_difference>=f_difference)
					{
						for(var i=0;i<count;i++)//remember last optimal solution
						{
							xv[i]=y[i];
						}
						last_f_difference=f_difference;
					}
					if(f_difference<0.01)
					{
						return;
					}
					if(k>=max_iteration)
					{	
						return;//return xv
					}
					//solve system J(y_new(i))(dy)=-F(y_new(i))
					//y_new(0)=y_old
					for(var j=0;j<count;j++)
					{
						for(var i=0;i<count;i++)
						{	
							var df=0.5*step*jacobian[i+j*count](y_old_new,t_next);
							if(i==j)
								df+=1.0;
							jacobian_m[i+j*count]=df;
						}
					}
					var dy=gaussSolve(jacobian_m,f);
					y_difference=0;//max norm for dy
					for(var i=0;i<count;i++)
					{
						y_difference=Math.max(dy[i],y_difference);
						y[i]=dy[i];
					}
					if(dy<0.01)
					{
						return;
					}
					k++;
					for(var i=0;i<count;i++)
						y_old_new[i]=0.5*(y_old[i]+y[i]);
				}
				return;

			}
			function StepConstJ(xv,t,step,funcs,jacobian)
			{
				var count=xv.length;
				var max_iteration=20;
				var f=new Array(count);
				var y=xv.slice();
				var t_next=t+step*0.5;
				var y_old=xv.slice();
				function BIGF(y_old_s,y_new_s,step,func_s,t_next,y_old_new_v)//s for scalar, v for vector
				//F(y(s+1))=y(s+1)-y(s)-h*f(t(s+1),y(s+1))
				{	
					var t=y_new_s-y_old_s-step*(func_s(y_old_new_v,t_next));//y_old_new_v = 0.5(y(s)+y(s+1,j))
					return t;
				}
				var y_old_new=new Array(count);
				y_old_new=xv.slice();

				var jacobian_m;
				var jacobian_t=new Array(count*count);
				for(var j=0;j<count;j++)
				{
					for(var i=0;i<count;i++)
					{
						if(i==j)
							jacobian_t[i+j*count]=1.0-0.5*step*jacobian[i+j*count];
						else
							jacobian_t[i+j*count]=-0.5*step*jacobian[i+j*count];
					}
				}
				dx=new Array(count);
				var k=0;
				var last_f_difference=Number.MAX_VALUE;
				while(true)
				{
					var f_difference=0;//max norm for F(y_old+dy)
					for(var i=0;i<count;i++)
					{
						f[i]=-BIGF(y_old[i],y[i],step,funcs[i],t_next,y_old_new);
						f_difference=Math.max(f_difference,Math.abs(f[i]));
					}
					if(last_f_difference>=f_difference)
					{
						for(var i=0;i<count;i++)//remember last optimal solution
						{
							xv[i]=y[i];
						}
						last_f_difference=f_difference;
					}
					if(k>=max_iteration)
					{	
						return;//return xv
					}
					if(f_difference<0.01)
					{
						return;
					}
					jacobian_m=jacobian_t.slice();
					var dy=gaussSolve(jacobian_m,f);
					y_difference=0;//max norm for dy
					for(var i=0;i<count;i++)
					{
						y_difference=Math.max(dy[i],y_difference);
						y[i]+=dy[i];
					}
					if(dy<0.01)
					{
						return;
					}
					for(var i=0;i<count;i++)
						y_old_new[i]=0.5*(y_old[i]+y[i]);
					k++;
				}
				return;
			}

			function Step(xv,t,step,funcs,options)
			{
				if(options!==undefined)
				{
					if(options.hasOwnProperty('jacobian'))
					{
						if(typeof options.jacobian[0] === "function")
						{
							return StepFuncJ(xv,t,step,funcs,options.jacobian);
						}else
						{
							return StepConstJ(xv,t,step,funcs,options.jacobian);
						}
					}
				}
				var count=xv.length;
				var max_iteration=20;
				var f=new Array(count);
				var y=xv.slice();
				var t_next=t+step*0.5;
				var y_old=xv.slice();
				function BIGF(y_old_s,y_new_s,step,func_s,t_next,y_old_new_v)//s for scalar, v for vector
				//F(y(s+1))=y(s+1)-y(s)-h*f(t(s+1),y(s+1))
				{	
					var t=y_new_s-y_old_s-step*(func_s(y_old_new_v,t_next));//y_old_new_v = 0.5(y(s)+y(s+1,j))
					return t;
				}
				var y_old_new=new Array(count);
				y_old_new=xv.slice();
				var jacobianStep=0.001;
				var jacobian=new Array(count*count);
				var k=0;
				//var t_next=t+step;
				var last_f_difference=Number.MAX_VALUE;
				while(true)
				{
					var f_difference=0;//max norm for F(y_old+dy)
					for(var i=0;i<count;i++)
					{
						f[i]=(-BIGF(y_old[i],y[i],step,funcs[i],t_next,y_old_new));
						f_difference=Math.max(f_difference,Math.abs(f[i]));
					}
					if(last_f_difference>=f_difference)
					{
						for(var i=0;i<count;i++)//remember last optimal solution
						{
							xv[i]=y[i];
						}
						last_f_difference=f_difference;
					}
					if(f_difference<0.001)
					{
						return;
					}
					if(k>=max_iteration)
					{	
						return;//return xv
					}
					//solve system J(y_new(i))(dy)=-F(y_new(i))
					//y_new(0)=y_old
					for(var j=0;j<count;j++)
					{
						for(var i=0;i<count;i++)
						{//df=y+jstep-h*f(t,y+jstep)-y+h*f(t,y)
							var y_temp=y[i];
							var df=(-funcs[j](y_old_new,t_next));
							y_old_new[i]+=0.5*jacobianStep;
							df=(-funcs[j](y_old_new,t_next)-df);
							df*=step;
							df/=jacobianStep;
							if(i==j)
								df+=1.0;
							jacobian[i+j*count]=df;
							y_old_new[i]=y_temp;
						}
					}
					var dy=gaussSolve(jacobian,f);
					y_difference=0;//max norm for dy
					for(var i=0;i<count;i++)
					{
						y_difference=Math.max(Math.abs(dy[i]),y_difference);
						y[i]+=dy[i];
					}
					if(y_difference<0.001)
					{
						return;
					}
					for(var i=0;i<count;i++)
						y_old_new[i]=0.5*(y_old[i]+y[i]);
				}
				k++;
				return;
			}
			return {Step:Step,attributes:{name:'Implicit Midpoint'},options:['useJacobian']};
		})();



		ImplicitRadauI5=(function(){
			var a_m;
			var c_v;
			var b_v;
			{
				var root6=Math.sqrt(6);
				a_m=[1/9,(-1-root6)/18,(-1+root6)/18,
				1/9,(88+7*root6)/360,(88-43*root6)/360,
		1/9,(88+43*root6)/360,(80-7*root6)/360];//row order
		b_v=[1/9,(16+root6)/36,(16-root6)/36];
		c_v=[0,(6-root6)/10,(6+root6)/10];
	}
	var k_number=3;
	var options={
		f_abs_error:0.001,
		f_rel_error:0.01,
		max_iteration:1000,
		max_newton_iteration:5,
		min_newton_abs_change:0.01,
		min_newton_rel_change:0.1
	};
	function Solve(data)
	{
		/*
		data={
			t0:,
			t1:,
			step:,
			xv:,
			max_iteration:,
			f_abs_error:,
			f_rel_error:,
			jacobian:,
			max_newton_iteration:
		}
		*/
		if(data.hasOwnProperty('jacobian'))
		{
			if(typeof data.jacobian[0] === "function")
			{
				return SolveFuncJ(data);
			}else
			{
				return SolveConstJ(data);
			}
		}
		var count=data.xv.length;
		var max_iteration=data.hasOwnProperty('max_iteration')?data.max_iteration:options.max_iteration;
		var f_abs_error=data.hasOwnProperty('f_abs_error')?data.f_abs_error:options.f_abs_error;
		var f_rel_error=data.hasOwnProperty('f_rel_error')?data.f_rel_error:options.f_rel_error;
		var max_newton_iteration=data.hasOwnProperty('max_newton_iteration')?data.max_newton_iteration:options.max_newton_iteration;
		var min_newton_abs_change=data.hasOwnProperty('min_newton_abs_change')?data.min_newton_abs_change:options.min_newton_abs_change;
		var min_newton_rel_change=data.hasOwnProperty('min_newton_rel_change')?data.min_newton_rel_change:options.min_newton_rel_change;
		var step=data.step;

		var t=data.t0;
		var t_end=data.t1;
		var ret_data=new Array(count);
		for(var i=0;i<count;i++)
			ret_data=new Array();

		var f=new Array(k_number*count);
		var y=data.xv.slice();
		var y_opt=y.slice();
		var y_old=y.slice();
		var k_v=new Array(k_number*count);
		for(var i=0;i<k_v.length;i++)
			k_v[i]=0;
		var k_temp=new Array(k_number);
		for(var i=0;i<k_number;i++)
		{
			k_temp[i]=new Array(count);
		}
		var t_v=new Array(k_number);
		function BIGF(k_s,y_h_a_k_sum_v,t_s,func_s)//s for scalar, v for vector
		{	
			var temp=k_s-func_s(y_h_a_k_sum_v,t_s);
			return temp;
		}
		
			//критерии остановки
			var jacobianStep=0.001;
			var jacobian=new Array(count*count*k_number*k_number);

			for(var ret_iter=0;max_iteration>0&&t<=t_end;i--,ret_iter++,t+=step)
			{
				var counter=0;
				var last_f_difference=Number.MAX_VALUE;
				var k_difference=0;
				for(var i=0;i<k_number;i++)
				{
					t_v[i]=t+step*c_v[i];
				}
				while(true)
				{
					var f_difference=0;//max norm for F(y_old+dy)
					for(var j=0,mn=0;j<k_number;j++)
					{
						var a_row_number=j*k_number;
						for(var i=0;i<count;i++)
						{
							var temp=0;
							for(var l=0,v=i;l<k_number;l++,v+=count)
							{
								temp+=a_m[a_row_number+l]*k_v[v];
							}
							ktemp[j][i]=y_old[i]+temp*step;
						}
						for(var i=0;i<count;i++,mn++)
						{
							f[mn]=(-BIGF(k_v[mn],ktemp[j],t_v[j],funcs[i]))
							f_difference=Math.max(f_difference,Math.abs(f[mn]));
						}
					}
					if(last_f_difference>=f_difference)
					{
						for(var i=0;i<count;i++)//remember last optimal solution
						{
							y_opt[i]=y[i];
						}
						last_f_difference=f_difference;
					}
					if(counter>=max_newton_iteration)
					{	
						break;//return xv
					}
					if(f_difference<0.001)
					{
						break;
					}
					//solve system J(y_new(i))(dy)=-F(y_new(i))
					//y_new(0)=y_old
					for(var p=0,z=0,it=0;p<k_number;p++)
					{	
						for(var j=0;j<count;j++,it++)
						{
							for(var l=0,m=0;l<k_number;l++)
								{	for(var i=0;i<count;i++,m++,z++)
									{
										var temp=k_temp[p][i];
										var df=(-funcs[j](k_temp[p],t_v[p]));
										k_temp[p][i]+=jacobianStep*a_m[p*k_number+l]*step;
										df=(-funcs[j](k_temp[p],t_v[p])-df); 
										df/=jacobianStep;
										if(m==it)
											df+=1.0;
										jacobian[z]=df;
										k_temp[p][i]=temp;
									}
								}
							}
						}
						var dk=gaussSolve(jacobian,f);
						for(var i=0;i<count;i++)
						{
							var temp=0;
							for(var j=0;j<k_number;j++)
							{
								var p=j*count+i;
								k_difference=Math.max(Math.abs(dk[p]),k_difference);
								k_v[p]+=dk[p];
								temp+=k_v[p]*b_v[j];
							}
							y[i]=y_old[i]+temp*step;
						}
						if(k_difference<0.001)
						{
							break;
						}
						counter++;
					}
					for(var i=0;i<count;i++)
					{
						y_old[i]=y_opt[i];
						ret_data[ret_iter].push(y_opt[i]);
					}
				}
				return ret_data
			}
			function SolveFuncJ(data)
			{



			}
			function SolveConstJ(data)
			{


			}
			function StepFuncJ(xv,t,step,funcs,jacobian)
			{
				var count=xv.length
				var max_iteration=20;
				var f=new Array(k_number*count);
				var y=xv.slice();
				var y_old=xv.slice();
				var k_v=new Array(k_number*count);
				for(var i=0;i<k_v.length;i++)
					k_v[i]=0;
				var ktemp=new Array(k_number);
				for(var i=0;i<k_number;i++)
				{
					ktemp[i]=new Array(count);
				}
				var t_v=new Array(k_number);
				for(var i=0;i<k_number;i++)
				{
					t_v[i]=t+step*c_v[i];
				}
				function BIGF(k_s,y_h_a_k_sum_v,t_s,func_s)//s for scalar, v for vector
				{	
					var t=k_s-func_s(y_h_a_k_sum_v,t_s);
					return t;
				}
				var jacobian_m=new Array(count*count*k_number*k_number);//матрица якоби для решения слау J(x{i})(x{i+1}-x{i})=-F(x{i})

		//критерии остановки
		var k=0;
		var last_f_difference=Number.MAX_VALUE;
		var k_difference=0;
		while(true)
		{
			var f_difference=0;//max norm for F(y_old+dy)
			{
				for(var j=0,mn=0;j<k_number;j++)
				{
					var a_row_number=j*k_number;
					for(var i=0;i<count;i++)
					{
						var temp=0;
						for(var l=0,v=i;l<k_number;l++,v+=count)
						{
							temp+=a_m[a_row_number+l]*k_v[v];
						}
						ktemp[j][i]=y_old[i]+temp*step;
					}
					for(var i=0;i<count;i++,mn++)
					{
						f[mn]=(-BIGF(k_v[mn],ktemp[j],t_v[j],funcs[i]))
						f_difference=Math.max(f_difference,Math.abs(f[mn]));
					}
				}
			}
			if(last_f_difference>=f_difference)
			{
						for(var i=0;i<count;i++)//remember last optimal solution
						{
							xv[i]=y[i];
						}
						last_f_difference=f_difference;
					}
					if(k>=max_iteration)
					{	
						return;//return xv
					}
					if(f_difference<0.001)
					{
						return;
					}
					
					if(k_difference<0.001)
					{
						return;
					}
					//solve system J(y_new(i))(dy)=-F(y_new(i))
					//y_new(0)=y_old
					for(var p=0,z=0,it=0;p<k_number;p++)
						for(var j=0;j<count;j++,it++)
						{
							for(var l=0,m=0;l<k_number;l++)
								{	for(var i=0;i<count;i++,m++,z++)
									{
										var k_temp=ktemp[p][i];
										var df=jacobian[j*count+i]()*a_m[p*k_number+l]*step;
										if(m==it)
											df+=1.0;
										jacobian_m[z]=df;
										ktemp[p][i]=k_temp;
									}
								}
							}
							jacobian_m=jacobian_t.slice();
							var dk=gaussSolve(jacobian_m,f);
							for(var i=0;i<count;i++)
							{
								var temp=0;
								for(var j=0;j<k_number;j++)
								{
									var p=j*count+i;
									k_difference=Math.max(Math.abs(dk[p]),k_difference);
									k_v[p]+=dk[p];
									temp+=k_v[p]*b_v[j];
								}
								y[i]=y_old[i]+temp*step;
							}
							k++;
						}
						return;

					}
					function StepConstJ(xv,t,step,funcs,jacobian)
					{
						var count=xv.length
						var max_iteration=20;
						var f=new Array(k_number*count);
						var y=xv.slice();
						var y_old=xv.slice();
						var k_v=new Array(k_number*count);
						for(var i=0;i<k_v.length;i++)
							k_v[i]=0;
						var ktemp=new Array(k_number);
						for(var i=0;i<k_number;i++)
						{
							ktemp[i]=new Array(count);
						}
						var t_v=new Array(k_number);
						for(var i=0;i<k_number;i++)
						{
							t_v[i]=t+step*c_v[i];
						}
				function BIGF(k_s,y_h_a_k_sum_v,t_s,func_s)//s for scalar, v for vector
				{	
					var t=k_s-func_s(y_h_a_k_sum_v,t_s);
					return t;
				}
				var jacobian_t=new Array(count*count*k_number*k_number);//матрица якоби для решения слау J(x{i})(x{i+1}-x{i})=-F(x{i})
				var jacobian_m;
				for(var p=0,z=0,it=0;p<k_number;p++)
					for(var j=0;j<count;j++,it++)
					{
						for(var l=0,m=0;l<k_number;l++)
							{	for(var i=0;i<count;i++,m++,z++)
								{
									var k_temp=ktemp[p][i];
									var df=jacobian[j*count+i]*a_m[p*k_number+l]*step;
									if(m==it)
										df+=1.0;
									jacobian_t[z]=df;
									ktemp[p][i]=k_temp;
								}
							}
						}
		//критерии остановки
		var k=0;
		var last_f_difference=Number.MAX_VALUE;
		var k_difference=0;
		while(true)
		{
			var f_difference=0;//max norm for F(y_old+dy)
			{
				for(var j=0,mn=0;j<k_number;j++)
				{
					var a_row_number=j*k_number;
					for(var i=0;i<count;i++)
					{
						var temp=0;
						for(var l=0,v=i;l<k_number;l++,v+=count)
						{
							temp+=a_m[a_row_number+l]*k_v[v];
						}
						ktemp[j][i]=y_old[i]+temp*step;
					}
					for(var i=0;i<count;i++,mn++)
					{
						f[mn]=(-BIGF(k_v[mn],ktemp[j],t_v[j],funcs[i]))
						f_difference=Math.max(f_difference,Math.abs(f[mn]));
					}
				}
			}
			if(last_f_difference>=f_difference)
			{
						for(var i=0;i<count;i++)//remember last optimal solution
						{
							xv[i]=y[i];
						}
						last_f_difference=f_difference;
					}
					if(k>=max_iteration)
					{	
						return;//return xv
					}
					if(f_difference<0.001)
					{
						return;
					}

					if(k_difference<0.001)
					{
						return;
					}
					//solve system J(y_new(i))(dy)=-F(y_new(i))
					//y_new(0)=y_old
					jacobian_m=jacobian_t.slice();
					var dk=gaussSolve(jacobian_m,f);
					for(var i=0;i<count;i++)
					{
						var temp=0;
						for(var j=0;j<k_number;j++)
						{
							var p=j*count+i;
							k_difference=Math.max(Math.abs(dk[p]),k_difference);
							k_v[p]+=dk[p];
							temp+=k_v[p]*b_v[j];
						}
						y[i]=y_old[i]+temp*step;
					}
					k++;
				}
				return;
			}
	function Step(xv,t,step,funcs,options)//OMG IT WORKS
	{
		if(options!==undefined)
		{
			if(options.hasOwnProperty('jacobian'))
			{
				if(typeof options.jacobian[0] === "function")
				{
					return StepFuncJ(xv,t,step,funcs,options.jacobian);
				}else
				{
					return StepConstJ(xv,t,step,funcs,options.jacobian);
				}
			}
		}
		var count=xv.length
		var max_iteration=20;
		var f=new Array(k_number*count);
		var y=xv.slice();
		var y_old=xv.slice();
		var k_v=new Array(k_number*count);
		for(var i=0;i<k_v.length;i++)
			k_v[i]=0;
		var ktemp=new Array(k_number);
		for(var i=0;i<k_number;i++)
		{
			ktemp[i]=new Array(count);
		}
		var t_v=new Array(k_number);
		for(var i=0;i<k_number;i++)
		{
			t_v[i]=t+step*c_v[i];
		}
		function BIGF(k_s,y_h_a_k_sum_v,t_s,func_s)//s for scalar, v for vector
		{	
			var t=k_s-func_s(y_h_a_k_sum_v,t_s);
			return t;
		}
		var jacobianStep=0.001;
		var jacobian=new Array(count*count*k_number*k_number);//матрица якоби для решения слау J(x{i})(x{i+1}-x{i})=-F(x{i})
		//критерии остановки
		var k=0;
		var last_f_difference=Number.MAX_VALUE;
		var k_difference=0;
		while(true)
		{
			var f_difference=0;//max norm for F(y_old+dy)
			{
				for(var j=0,mn=0;j<k_number;j++)
				{
					var a_row_number=j*k_number;
					for(var i=0;i<count;i++)
					{
						var temp=0;
						for(var l=0,v=i;l<k_number;l++,v+=count)
						{
							temp+=a_m[a_row_number+l]*k_v[v];
						}
						ktemp[j][i]=y_old[i]+temp*step;
					}
					for(var i=0;i<count;i++,mn++)
					{
						f[mn]=(-BIGF(k_v[mn],ktemp[j],t_v[j],funcs[i]))
						f_difference=Math.max(f_difference,Math.abs(f[mn]));
					}
				}
			}
			if(last_f_difference>=f_difference)
			{
						for(var i=0;i<count;i++)//remember last optimal solution
						{
							xv[i]=y[i];
						}
						last_f_difference=f_difference;
					}
					if(k>=max_iteration)
					{	
						return;//return xv
					}
					if(f_difference<0.001)
					{
						return;
					}
					//solve system J(y_new(i))(dy)=-F(y_new(i))
					//y_new(0)=y_old
					{for(var p=0,z=0,it=0;p<k_number;p++)
						for(var j=0;j<count;j++,it++)
						{
							for(var l=0,m=0;l<k_number;l++)
								{	for(var i=0;i<count;i++,m++,z++)
									{
										var k_temp=ktemp[p][i];
										var df=(-funcs[j](ktemp[p],t_v[p]));
										ktemp[p][i]+=jacobianStep*a_m[p*k_number+l]*step;
										df=(-funcs[j](ktemp[p],t_v[p])-df); 
										df/=jacobianStep;
										if(m==it)
											df+=1.0;
										jacobian[z]=df;
										ktemp[p][i]=k_temp;
									}
								}
							}
						}
						var dk=gaussSolve(jacobian,f);
						for(var i=0;i<count;i++)
						{
							var temp=0;
							for(var j=0;j<k_number;j++)
							{
								var p=j*count+i;
								k_difference=Math.max(Math.abs(dk[p]),k_difference);
								k_v[p]+=dk[p];
								temp+=k_v[p]*b_v[j];
							}
							y[i]=y_old[i]+temp*step;
						}
						if(k_difference<0.001)
						{
							return;
						}
						k++;
					}
					return;
				}
				return {Step:Step,Solve:Solve,attributes:{name:'Radau 5th order'},options:['useJacobian']};
			})();