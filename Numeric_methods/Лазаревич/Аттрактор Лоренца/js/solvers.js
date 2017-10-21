
//special


SemiImplicitEuler=(function()
{
	function Step(x,v,t,delta,funcs,error)//funcs:[velocity,acceleration]
	{
		/*
		v(n+1)=v(n)+dt*g(x(n));
		x(n+1)=x(n)+dt*f(v(n+1));

		*/

		//func(t,x,v);
		var dimensions=x.length;
		var vt=new Array(dimensions);
		for(var i=0;i<dimensions;i++)
		{
			vt[i]=v[i]+delta*funcs(t,x,v);
		}
		for(var i=0;i<dimensions;i++)
		{
			v[i]=vt[i];
			x[i]+=delta*funcs(t,x,vt);
		}
	}
	function StepVector(xv,t,delta,funcs)
	{
		dimensions=xv.length/2;
		vt=new Array(dimensions);
		for(var i=0;i<dimensions;i++)
		{
			vt[i]=xv[i+dimensions]+delta*funcs(xv,t);
		}
		for(var i=0;i<dimensions;i++)
		{
			xv[i+dimensions]=vt[i];
		}
		for(var i=0;i<dimensions;i++)
		{
			xv[i]+=delta*funcs(xv,t);
		}
	}

	return {Step:Step,StepVector:StepVector};
})();



//multistep
StormerVerlet=(function()
{
	var step=0;
	var xv_last=null;
	var delta_last=1;
	function Init()
	{
		step=0;
		xv_last=null;
		delta_last=1;
	}
	function Step(xv,t,delta,funcs)//x(n+1)=2*x(n)-x(n-1)+A(xn)dt^2
	//xv:[positions(count),velocities(count)]
	//funcs:[x',x'']
	{
		if(step=0)
		{
			xv_last=xv.slice();
			delta_last=dt;
			ExplicitEulerSystem(xv,t,delta,funcs);
			step=1;
			return;
		}
		var count=xv.length/2;
		var k=new Array(count);
		for(var i=0;i<count;i++)
		{
			k[i]=xv[i]+(xv[i]-xv_last[i])*delta/delta_last+funcs[i+count](xv,t)*delta*(delta+delta_last)*0.5;
		}
		xv_last=xv.splice();
		for(var i=0;i<count;i++)
		{
			xv[i+count]=k[i]/delta;
			xv[i]+=k[i];
		}
	}
	return {Step:Step,Init:Init};

})();


VelocityVerlet=(function()
{
	function Step(xv,t,delta,funcs)//x(n+1)=2*x(n)-x(n-1)+A(xn)dt^2
	{
		var count=xv.length/2;
		var xv_half_t=new Array(xv.length);
		for(var i=0;i<count;i++)
		{
			var temp=xv_half_t[i+count]=xv[i+count]+0.5*funcs[i+count](xv,t)*delta;
			xv_half_t[i]=xv[i]+temp*delta;
		}
		for(var i=0;i<count;i++)
		{
			xv[i]=xv_half_t[i];
		}
		var t_next=t+delta;
		for(var i=0;i<count;i++)
		{
			xv[i+count]=xv_half_t[i+count]+0.5*funcs[i+count](xv,t_next)*delta;
		}
	}
		function StepAlt(xv,t,delta,funcs)//x(n+1)=2*x(n)-x(n-1)+A(xn)dt^2
		{
			var count=xv.length/2;
			var xa_temp=new Array(xv.length);
			for(var i=0;i<count;i++)
			{
				xa_temp[i+count]=funcs[i+count](xv,t);//a(t)
				xa_temp[i]=xv[i]+(xv[i+count]+0.5*xa_temp[i+count]*delta)*delta;//x(t+dt)
			}
			for(var i=0;i<count;i++)
			{
				xv[i]=xa_temp[i];
			}
			var t_next=t+delta;
			for(var i=0;i<count;i++)
			{
				xa_temp[i]=xv[i+count]+0.5*(xa_temp[i+count]+funcs[i+count](xv,t+delta))*delta;//v(t+dt)=v(t)+0.5(a(t)+a(t+dt))*dt
			}
			for(var i=0;i<count;i++)
			{
				xv[i+count]=xa_temp[i];
			}
		}

		return {Step:Step};
	})();







//general
Ralston=(function()
{

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
		return {Step:Step};
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
		return {Step:Step};
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
		return {Step:Step};
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
	return {Step:Step};
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
	return {Step:Step};
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

	return {Step:Step};
})();



var RK4Implicit=(function()
{




})();
