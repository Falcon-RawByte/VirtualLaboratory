var Methods;
function QRAlgorithm(matrix,rank,iterations)
		{
			var eigenvalues={values:new Array(rank),iterations:0};
			var epsilon=0.001;
			if(rank==1)
			{
				eigenvalues.values[0]=matrix[0];
				return eigenvalues;
			}else if(rank==2)
			{
				var b=matrix[0]+matrix[3];
				var c=matrix[0]*matrix[3]-matrix[1]*matrix[2];
				var D=Math.sqrt(Math.abs(b*b-4.0*c));
				eigenvalues.values[0]=(b+D)*0.5;
				eigenvalues.values[1]=(b-D)*0.5;
				return eigenvalues;
				//need only real part
			}
			var A=matrix.slice();
			//преобразование к матрице хессенберга
			var u=new Array(rank);
			//var P=new Array(matrix.length);
			for(var i=0;i<rank-2;i++)
			{
				var xnorm=0.0;
				for(var k=0,j=i+1;j<rank;j++,k++)
					{
						u[k]=A[i+j*rank];
						xnorm+=u[k]*u[k];
					}
				var ro=-Math.sign(A[(i+1)*rank+i]);
				var unorm=xnorm-A[i+(i+1)*rank]*A[i+(i+1)*rank];
				u[0]-=ro*Math.sqrt(xnorm);
				unorm+=u[0]*u[0];
				unorm=Math.sqrt(unorm);
				for(var j=0;j<rank-i;j++)
				{
					u[j]/=unorm;
				}
				var u_A=new Array(rank-i);//uk* Ak+1:n,k:n

				for(var j=i;j<rank;j++)	
				{
					var temp=0.0;
					for(var k=i+1;k<rank;k++)
					{
						temp+=u[k-i-1]*A[(k*rank)+(j)];
					}
					u_A[j-i]=temp;
				}

				for(var j=i+1;j<rank;j++)
				{
					for(var k=i;k<rank;k++)
					{
						A[j*rank+k]-=u[j-i-1]*2.0*u_A[k-i];
					}
				}
				u_A=new Array(rank);
				for(var j=0;j<rank;j++)	
				{
					var temp=0.0;
					for(var k=i+1;k<rank;k++)
					{
						temp+=u[k-i-1]*A[(j*rank)+(k)];
					}
					u_A[j]=temp;
				}

				for(var j=0;j<rank;j++)
				{
					for(var k=i+1;k<rank;k++)
					{
						A[j*rank+k]-=2.0*(u_A[j]*u[k-i-1]);
					}
				}
				/*Generate the Householder reflector Pk;
				4:*/ /* Apply Pk = Ik ⊕ (In−k − 2ukuk
				∗
				) from the left to A */
				/*5: Ak+1:n,k:n := Ak+1:n,k:n − 2uk(uk
				∗Ak+1:n,k:n);
				6: *//* Apply Pk from the right, A := APk */
				/*7: A1:n,k+1:n := A1:n,k+1:n − 2(A1:n,k+1:nuk)uk
				∗
				;*/


			}
			
			for(var i=0;i<rank-2;i++)
			{
				for(var j=i+2;j<rank;j++)
				{
					A[j*rank+i]=0.0;
				}
			}
			//qr decomposition
			//сдвиги
			var iter=0;
			for(var p=rank-1;p>1;)
			{
				var q=p-1;
				var s=A[q+q*rank]+A[p+p*rank];
				var t=A[q+q*rank]*A[p+p*rank]-A[q+p*rank]*A[p+q*rank];
				var x=A[0]*A[0]+A[1]*A[rank]-s*A[0]+t;
				var y=A[rank]*(A[0]+A[1+rank]-s);
				var z=A[rank]*A[2*rank+1];
				for(var k=0;k<=p-2;k++)
				{
					//
					//
					r=Math.max(0,k-1);
					//Hk+1:k+3;r:n=Pt Hk+1:k+3;r:n
					var p_V=[x,y,z];

					var xyzsqrnorm=x*x+y*y+z*z;
					var ro=-Math.sign(x);
					p_V[0]-=ro*Math.sqrt(xyzsqrnorm);
					var pvnorm=p_V[0]*p_V[0]+p_V[1]*p_V[1]+p_V[2]*p_V[2];
					pvnorm=Math.sqrt(pvnorm);
					for(var j=0;j<3;j++)
					{
						p_V[j]/=pvnorm;
					}
					var s=y*y+z*z;
					p_V=[x,y,z];//transposed
					p_V[0]=x-ro*Math.sqrt(x*x+s);
					pvnorm=Math.sqrt(p_V[0]*p_V[0]+s);
					for(var j=0;j<3;j++)
					{
						p_V[j]/=pvnorm;
					}

					var p_t=new Array(rank-r);
					for(var j=r;j<rank;j++)
					{
						var temp=0.0;
						for(var i=k;i<k+3;i++)
						{
							temp+=p_V[i-k]*A[(i*rank)+j];
						}
						p_t[j-r]=temp;
					}
					for(var j=k;j<k+3;j++)//+
					{
						var temp=0.0;
						for(var i=r;i<rank;i++)
						{
							A[(j*rank)+i]-=2.0*p_V[j-k]*p_t[i-r];
						}
					}

					//p_V=[x/s,y/s,z/s];
					r=Math.min(k+3,p);
					//H1:r;k+1:k+3=H1:r;k+1:k+3*P
					var p_t=new Array(r+1);
					for(var j=0;j<=r;j++)
					{
						var temp=0.0;
						for(var i=k;i<k+3;i++)
						{
							temp+=p_V[i-k]*A[(j*rank)+i];
						}
						p_t[j]=temp;
					}

					for(var i=0;i<=r;i++)
					{
						for(var j=k;j<k+3;j++)
						{
							A[(i*rank)+j]-=2.0*p_V[j-k]*p_t[i];
						}
					}
					x=A[rank*(k+1)+k];
					y=A[rank*(k+2)+k];
					if(k<p-2)
					{
						z=A[(k+3)*rank+k];
					}
				}
				//
				var	p_V=[x,y];
				var xyzsqrnorm=x*x+y*y;
				var ro=-Math.sign(x);
				p_V[0]-=ro*Math.sqrt(xyzsqrnorm);
				var pvnorm=p_V[0]*p_V[0]+p_V[1]*p_V[1];
				pvnorm=Math.sqrt(pvnorm);
				for(var j=0;j<2;j++)
				{
					p_V[j]/=pvnorm;
				}

				/*p_V=[1.0,y/(Math.sqrt(xyzsqrnorm)+Math.abs(x))];
				pvnorm=Math.sqrt(1.0+p_V[1]*p_V[1]);
				for(var j=0;j<2;j++)
				{
					p_V[j]/=pvnorm;
				}*/
				var s=y*y;
				p_V=[x,y];//transposed
				p_V[0]=x-ro*Math.sqrt(x*x+s);
				pvnorm=Math.sqrt(p_V[0]*p_V[0]+s);
				for(var j=0;j<2;j++)
				{
					p_V[j]/=pvnorm;
				}

				var p_t=new Array(rank-p+2);
				for(var j=p-2;j<rank;j++)
				{
					var temp=0.0;
					for(var i=q;i<=p;i++)
					{
						temp+=p_V[i-q]*A[i*rank+j];
					}
					p_t[j-p+2]=temp;
				}
				for(var i=q;i<=p;i++)
				{
					for(var j=p-2;j<rank;j++)
					{
						A[i*rank+j]-=2.0*p_V[i-q]*p_t[j-p+2];
					}
				}


				p_t=new Array(p+1);
				for(var j=0;j<=p;j++)
				{
					var temp=0.0;
					for(var i=p-1;i<=p;i++)
					{
						temp+=p_V[i-p+1]*A[j*rank+i];
					}
					p_t[j]=temp;
				}

				for(var i=0;i<=p;i++)
				{
					for(var j=p-1;j<=p;j++)
					{
						A[i*rank+j]-=2.0*p_V[j-p+1]*p_t[i];
					}
				}
				if(Math.abs(A[p*rank+q])<epsilon*(Math.abs(A[q*rank+q])+Math.abs(A[p*rank+p])))
				{
					A[p*rank+q]=0;
					p=p-1;
					q=p-1;
				}else if(Math.abs(A[(p-1)*rank+q-1])<epsilon*(Math.abs(A[(q-1)*rank+q-1])+Math.abs(A[q*rank+q])))
				{
					A[(p-1)*rank+(q-1)]=0;
					p=p-2;
					q=p-1;
				}
				iter++;
				if(iter>iterations)
					break;
			}
			eigenvalues.iterations=iter;
			for(var i=0;i<rank;i++)
			{
				eigenvalues.values[i]=A[i*(rank+1)];
			}
			return eigenvalues;
		}


InitMethods=function(){
	function gaussSolve(matrix,y)
		{
			var rang=y.length;
			var x=new Array(rang);
			epsilon=0.001
			function index(i,j)
			{
				return i*rang + j;
			};
			var indexes = new Array(rang);
			for (var i = 0; i < rang; i++)
			{
				indexes[i] = i;
			}
			for (var l = 0; l < rang; l++)
			{
				var max = l;
				for (var i = l + 1; i < rang; i++)
				{
					if (Math.abs(matrix[index(indexes[i], l)])>Math.abs(matrix[index(indexes[max], l)]))
						max = i;
				}
				//нашёл максимальный элемент
				//переставляю строки
				if (max != l)
				{
					var temp = indexes[l];
					indexes[l] = indexes[max];
					indexes[max] = temp;
				}
				if (Math.abs(matrix[index(indexes[l],l)]) < epsilon)
				{
					for(var i=0;i<rang;i++)
						x[i]=0.0;
					return x;
				}
				for (var i = l + 1; i < rang; i++)
					matrix[index(indexes[l], i)] = matrix[index(indexes[l],i)] / matrix[index(indexes[l],l)];
				y[indexes[l]] = y[indexes[l]] / matrix[index(indexes[l],l)];
				matrix[index(indexes[l],l)] = 1;

				for (var i = l + 1; i < rang; i++)
				{
					for (var k = l + 1; k < rang; k++)
						matrix[index(indexes[i],k)] = matrix[index(indexes[i],k)] - matrix[index(indexes[i],l)] * matrix[index(indexes[l],k)];
					y[indexes[i]] = y[indexes[i]] - matrix[index(indexes[i],l)] * y[indexes[l]];
					matrix[index(indexes[i],l)] = 0;
				}
			}
			x[rang - 1] = y[indexes[rang - 1]];
			for (var i = rang - 2; i > -1; i--)
			{
				var k = 0.;
				for (var j = i + 1; j < rang; j++)
				{
					k = k + matrix[index(indexes[i],j)] * x[j];
				}
				x[i] = y[indexes[i]] - k;
			}
			return x;
		}
		//https://www.inf.ethz.ch/personal/gander/papers/qrneu.pdf
		//http://people.inf.ethz.ch/arbenz/ewp/Lnotes/chapter4.pdf
		



	Methods=(function()
	{
		ExplicitEulerMethod=(function()	{
				var step=0;
				var minStep=0;
				var maxStep=0;
				var errorTolerance;
				var funcs;
				function Init(options)
				{
					//console.log(options);
					step=options.step;
					funcs=options.funcsVector;
					minStep=(options.minStep!==undefined?options.minStep:0.01);
					maxStep=(options.maxStep!==undefined?options.maxStep:0.2);
					errorTolerance=(options.errorTolerance!==undefined?options.errorTolerance:0.001);
					if(minStep==maxStep)
					{
						this.Step=Step;
					}else
					{
						this.Step=AutoStep;
					}
				}
				function AutoStep(data,complexity)
				{
						var count=data.xv.length;
						var k=new Array(count);
						var k2=new Array(count);
						var halfstep=step*0.5;
						for(var i=0;i<count;i++)
						{
							k[i]=funcs[i](data.xv,data.t);
							k2[i]=k[i]*halfstep;
							k[i]*=step;
							k[i]+=data.xv[i];
						}
						var xvTemp=new Array(count);
						for(var i=0;i<count;i++)
							xvTemp[i]=data.xv[i]+k2[i];
						for(var i=0;i<count;i++)
						{
							k2[i]=xvTemp[i]+halfstep*funcs[i](xvTemp,data.t+halfstep);
						}
						var difference=0;
						for(var i=0;i<count;i++)
						{
							var t=k2[i]-k[i];
							difference+=(t*t);
						}
						difference=Math.sqrt(difference);
						var delta_calc=0.9*errorTolerance/difference*step;
						//console.log(delta_calc);
						var tStep=step;
						step=Math.min(Math.max(minStep,delta_calc),maxStep);
						complexity.rightSideEvaluation+=count*2;
						if(step<halfstep)//если шаг меньше половины иходного, посчитать заново
						{
							return Step(data,complexity);
						}
						complexity.currentStep=tStep;
						complexity.averageStep+=tStep;
						data.t+=tStep;
						data.xv=k2;
				}
				function Step(data,complexity)
				{
						//console.log(data);
						var count=data.xv.length;
						var k=new Array(count);
						for(var i=0;i<count;i++)
						{
							k[i]=step*funcs[i](data.xv,data.t);
						}
						for(var i=0;i<count;i++)
							data.xv[i]+=k[i];
						data.t+=step;
						complexity.rightSideEvaluation+=count;
						complexity.currentStep=step;
						complexity.averageStep+=step;
				}
				return {Init:Init,Step:Step,attributes:{name:'Явный метод Эйлера с автошагом'},options:['autoStep']};
			})();
		ExplicitRalston=(function(){
				var step=0;
				var funcs;
				function Init(options)
				{
					step=options.step;
					funcs=options.funcsVector;
				}
				function Step(data,complexity)
				{
					var count=data.xv.length;
					var k1=new Array(count);
					var ktemp=new Array(count);
					for(var i=0;i<count;i++)
					{
						k1[i]=funcs[i](data.xv,data.t)*step;
						ktemp[i]=k1[i]*0.666667+data.xv[i];
						data.xv[i]+=k1[i]*0.25;
					}
					var t_next=data.t+step*0.666667;
					for(var i=0;i<count;i++)
					{
							//k2 = h f(xi + 2 h / 3, yi + 2 k1 / 3 )
						data.xv[i]+=0.75*funcs[i](ktemp,t_next)*step;
					}
					data.t+=step;
					complexity.rightSideEvaluation+=count*2.0;
					complexity.currentStep=step;
					complexity.averageStep+=step;
				}
				return {Init:Init,Step:Step,attributes:{name:'Метод Ральстона(РК2)'}};
			})();
		ExplicitTrapezoidal=(function(){//y(i,n+1)=y(i,n)+dt/2*(f(t,y(n))+f(t+dt,y(n+1')))
				/*
				y(n+1)=y(n)*0.5+y(n+1')*0.5+h*0.5*f(t+dt,y(n+1'))
				*/
				var step=0;
				var funcs;
				function Init(options)
				{
					step=options.step;
					funcs=options.funcsVector;
				}
				function Step(data,complexity)
				{
					var count=data.xv.length;
					var k=new Array(count);
					var temp=new Array(count);
					for(var i=0;i<count;i++)
					{
						temp[i]=data.xv[i]+funcs[i](data.xv,data.t)*step;
					}
					var t_next=data.t+step;
					for(var i=0;i<count;i++)
					{
						//k[i]=delta*0.5*(funcs[i](t,xv)+funcs[i](t_next,t));
						data.xv[i]=(funcs[i](temp,t_next)*step+temp[i]+data.xv[i])*0.5;
					}
					data.t+=step;
					complexity.rightSideEvaluation+=count*2;
					complexity.currentStep=step;
					complexity.averageStep+=step;
				}
				return {Step:Step,Init:Init,attributes:{name:'Явный метод трапеции'}};
			})();
		ExplicitMidpoint=(function(){//y(i,n+1)=y(i,n)+dt*f(t+dt*0.5,(y(n)+y(n+1))*0.5)
				var step=0;
				var funcs;
				function Init(options)
				{
					step=options.step;
					funcs=options.funcsVector;
				}
				function Step(data,complexity)
				{
					var count=data.xv.length;
					t_average=data.t+step*0.5;
					var temp=new Array(count);
					for(var i=0;i<count;i++)
					{
						temp[i]=(data.xv[i]+funcs[i](data.xv,data.t)*step*0.5);
					}
					for(var i=0;i<count;i++)
					{
						data.xv[i]+=step*funcs[i](temp,t_average);
					}
					data.t+=step;
					complexity.rightSideEvaluation+=2*count;
					complexity.currentStep=step;
					complexity.averageStep+=step;
				}
				return {Step:Step,Init:Init,attributes:{name:'Явный метод средней точки'}};
			})();

		ExplicitRK4=(function(){
				var step=0;
				var funcs;
				function Init(options)
				{
					step=options.step;
					funcs=options.funcsVector;
				}
				function Step(data,complexity)
				{
					var count=data.xv.length;
					var k=new Array(4*count);
					var ktemp=new Array(count);
					for(var i=0;i<count;i++)
					{
						k[i]=step*funcs[i](data.xv,data.t);
						ktemp[i]=data.xv[i]+k[i]*0.5;
					}
					for(var i=0;i<count;i++)
					{
						k[count+i]=step*funcs[i](ktemp,data.t+step*0.5);
					}
					for(var i=0;i<count;i++)
					{
						ktemp[i] = data.xv[i] + k[count + i] * 0.5;
					}
					var count2 = count +count;
					for (var i = 0; i < count; i++)
					{	
						k[count2 + i] = step*funcs[i](ktemp, data.t + step*0.5);
					}
					for(var i=0;i<count;i++)
					{
						ktemp[i] = data.xv[i] + k[count2 + i];
					}
					var count3 = count + count2;
					for (var i = 0; i < count; i++)
						k[count3 + i] = step*funcs[i](ktemp, data.t + step);
					var koeff = 1.0 / 6.0;
					for (var i = 0; i < count; i++)
						data.xv[i] += koeff*(k[i] + 2.*(k[i + count] + k[i + count2]) + k[i + count3]);
					data.t+=step;
					complexity.rightSideEvaluation+=count*4;
					complexity.currentStep=step;
					complexity.averageStep+=step;
				}

				return {Step:Step,Init:Init,attributes:{name:'Метод Рунге-Кутты 4 порядка'}};
			})();
		ExplicitDormandPrince=(function(){
			var a=[1/5,
			3/40,9/40,
			44/45,-56/15, 32/9,
			19372/6561,-25360/2187, 64448/6561,-212/729,
			9017/3168,-355/33, 46732/5247,49/176,-5103/18656,
			35/384,0,500/1113,125/192,-2187/6784,11/84
			];
			var b1=[35/384,0,500/1113,125/192,-2187/6784,11/84];
			var b2=[5179/57600,0,7571/16695,393/640,-92097/339200,187/2100,1/40];
			var c=[1/5,3/10,4/5,8/9,1,1];
			var kdiff=[71/57600,0,-71/16695,71/1920,-17253/339200,22/525,-1/40];
			var step=0;
			var minStep=0;
			var maxStep=0;
			var errorTolerance;
			var funcs;
			function Init(options)
			{
				step=options.step;
				funcs=options.funcsVector;
				minStep=(options.minStep!==undefined?options.minStep:0.01);
				maxStep=(options.maxStep!==undefined?options.maxStep:0.2);
				errorTolerance=(options.errorTolerance!==undefined?options.errorTolerance:0.001);
				if(minStep==maxStep)
				{
					this.Step=Step;
				}else
				{
					this.Step=AutoStep;
				}
			}
			function AutoStep(data,complexity)
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
							k[i][j]=funcs[j](ktemp,t_i)*step;
						var tIterator=aIterator;
						for(var j=0;j<count;j++)
						{
							aIterator=tIterator;
							var temp=0;
							for(var l=0;l<=i;l++)
							{
								temp+=a[aIterator]*k[l][j];
								aIterator++;
							}
							ktemp[j]=temp+data.xv[j];
						}
						t_i=data.t+c[i]*step;
						//console.log('ktemp '+ktemp);
					}
					for(var j=0;j<count;j++)
						k[6][j]=funcs[j](ktemp,t_i)*step;
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
					//console.log(stepOpt);
					if(isNaN(stepOpt))
					{
						stepOpt=minStep;
					}
					stepOpt=Math.min(Math.max(minStep,stepOpt),maxStep);
					complexity.rightSideEvaluation+=8*count;
					if(stepOpt*2<step)
					{
						step=stepOpt;
						Step(data,complexity);
						return;
					}else
					{
						for(var i=0;i<6;i++)
						{
							for(var j=0;j<count;j++)
								data.xv[j]+=k[i][j]*b1[i];
						}
					}
					complexity.currentStep=step;
					complexity.averageStep+=step;
					data.t+=step;
					step=stepOpt;
			}
			function Step(data,complexity)
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
								k[i][j]=funcs[j](ktemp,t_i)*step;
							}
						var tIterator=aIterator;
						for(var j=0;j<count;j++)
						{
							aIterator=tIterator;
							var temp=0;
							for(var l=0;l<=i;l++)
							{
								temp+=a[aIterator]*k[l][j];
								aIterator++;
							}
							ktemp[j]=temp+data.xv[j];
						}
						t_i=data.t+c[i]*step;
					}
					for(var j=0;j<count;j++)
						k[5][j]=funcs[j](ktemp,t_i)*step;
					for(var i=0;i<6;i++)
					{
						for(var j=0;j<count;j++)
							data.xv[j]+=k[i][j]*b1[i];
					}
					//console.log(data.xv);
					data.t+=step;
					complexity.rightSideEvaluation+=count*7;
					complexity.currentStep=step;
					complexity.averageStep+=step;
			}
			return {Step:Step,Init:Init,attributes:{name:'Метод Дорманда-Принса 5 порядка'},options:['autoStep']};
			})();

		ImplicitEuler=(function(){
			var step=0;
			var funcs;
			var jacobianConst=false;
			var jacobian=null;
			var jacobian_m;
			function BIGF(y_old_s,y_new_s,step,func_s,t_next,y_new_v)//s for scalar, v for vector
			//F(y(s+1))=y(s+1)-y(s)-h*f(t(s+1),y(s+1))
			{	
				var t=y_new_s-y_old_s-step*func_s(y_new_v,t_next);
				return t;
			}
			function Init(options)
			{
				step=options.step;
				funcs=options.funcsVector;
				if(options.jacobianCalc==true)
				{
					jacobian=options.jacobian;
					this.Step=StepAnalytic;
				}else
				{
					this.Step=StepNumeric;
				}
				jacobianConst=(options.jacobianConst==true?true:false);
				var count=funcs.length;
				jacobian_m=new Array(count*count);
			}
			function StepAnalytic(data,complexity)
			{
				var count=data.xv.length;
				var max_iteration=10;
				var f=new Array(count);
				var y=data.xv.slice();
				var t_next=data.t+step;
				var y_old=data.xv.slice();
				var k=0;
				var last_f_difference=Number.MAX_VALUE;
				if(jacobianConst==true)
				{
					for(var j=0;j<count;j++)
					{
						for(var i=0;i<count;i++)
						{	
							var df=-step*jacobian[i+j*count](y,t_next);
							if(i==j)
								df+=1.0;
							jacobian_m[i+j*count]=df;
						}
					}
				}
				for(var i=0;i<count;i++)
				{
					f[i]=-BIGF(y_old[i],y[i],step,funcs[i],t_next,y);
					last_f_difference=Math.max(last_f_difference,Math.abs(f[i]));
				}
				while(true)
				{
					//solve system J(y_new(i))(dy)=-F(y_new(i))
					//y_new(0)=y_old
					var dy;
					if(jacobianConst==true)
					{
						var jacobian_t=jacobian_m.slice();
						dy=gaussSolve(jacobian_t,f);
					}
					else
					{
						for(var j=0;j<count;j++)
						{
							for(var i=0;i<count;i++)
							{	
								var df=-step*jacobian[i+j*count](y,t_next);
								if(i==j)
									df+=1.0;
								jacobian_m[i+j*count]=df;
							}
						}
						dy=gaussSolve(jacobian_m,f);
					}
					y_difference=0;//max norm for dy
					for(var i=0;i<count;i++)
					{
						y_difference=Math.max(Math.abs(dy[i]),y_difference);
						y[i]+=dy[i];
					}
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
				complexity.currentStep=step;
				complexity.averageStep+=step;
				if(jacobianConst!=true)
					complexity.rightSideEvaluation+=count*count*k;
				else
					complexity.rightSideEvaluation+=count*count;
				data.t+=step;
				return;
			}
			function StepNumeric(data,complexity)
			{
				var count=data.xv.length;
				var max_iteration=10;
				var f=new Array(count);
				var y=data.xv.slice();
				var t_next=data.t+step;
				var y_old=data.xv.slice();
				var jacobianStep=0.001;
				var k=0;
				var last_f_difference=Number.MAX_VALUE;
				if(jacobianConst==true)
				{
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
							jacobian_m[i+j*count]=df;
							y[i]=y_temp;
						}
					}
				}
				for(var i=0;i<count;i++)
				{
					f[i]=(-BIGF(y_old[i],y[i],step,funcs[i],t_next,y));
					last_f_difference=Math.max(last_f_difference,Math.abs(f[i]));
				}
				while(true)
				{
					
					//solve system J(y_new(i))(dy)=-F(y_new(i))
					//y_new(0)=y_old
					var dy;
					if(jacobianConst==true)
					{
						var jacobian_t=jacobian_m.slice();
						dy=gaussSolve(jacobian_t,f);
					}else
					{
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
								jacobian_m[i+j*count]=df;
								y[i]=y_temp;
							}
						}
						dy=gaussSolve(jacobian_m,f);
					}
					y_difference=0;//max norm for dy
					for(var i=0;i<count;i++)
					{
						y_difference=Math.max(Math.abs(dy[i]),y_difference);
						y[i]+=dy[i];
					}
					k++;
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
				complexity.currentStep=step;
				complexity.averageStep+=step;
				if(jacobianConst!=true)
					complexity.rightSideEvaluation+=count*count*k*2;
				else
					complexity.rightSideEvaluation+=count*count*2;
				//complexity.rightSideEvaluation+=(k+1)*count;
				data.t+=step;
				return;
			}
			return {Step:StepNumeric,Init:Init,attributes:{name:'Неявный метод Эйлера'},options:['useJacobian']};
			})();

		ImplicitRadauI5=(function(){
			var step=0;
			var funcs;
			var jacobianConst=false;
			var jacobian=null;
			var jacobian_m;
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
			var methodOptions={f_abs_error:0.001,
			max_newton_iterations:5,
			min_newton_abs_change:0.01,
			min_newton_rel_change:0.1,
			k_abs_error:0.001
			}
			var k_order=3;
			var max_iteration=10;
			function BIGF(k_s,y_h_a_k_sum_v,t_s,func_s)//s for scalar, v for vector
			{	
				var t=k_s-func_s(y_h_a_k_sum_v,t_s);
				return t;
			}
			function Init(options)
			{
				step=options.step;
				funcs=options.funcsVector;
				if(options.jacobianCalc==true)
				{
					jacobian=options.jacobian;
					this.Step=StepAnalytic;
				}else
				{
					this.Step=StepNumeric;
				}
				jacobianConst=(options.jacobianConst==true?true:false);
				var count=funcs.length;
				jacobian_m=new Array(k_order*k_order*count*count);
			}
			function StepNumeric(data,complexity)
			{
				var count=data.xv.length;
				var f=new Array(k_order*count);
				var y=data.xv.slice();
				var y_old=data.xv.slice();
				var k=0;
				var last_f_difference=Number.MAX_VALUE;
				var k_difference=Number.MAX_VALUE;
				var k_v=new Array(k_order*count);
				for(var i=0;i<k_v.length;i++)
					k_v[i]=0;
				var ktemp=new Array(k_order);
				var jacobianStep=0.001;
				for(var i=0;i<k_order;i++)
				{
					ktemp[i]=new Array(count);
				}
				var t_v=new Array(k_order);
				for(var i=0;i<k_order;i++)
				{
					t_v[i]=data.t+step*c_v[i];
				}
					
				if(jacobianConst==true)
				{
					{for(var p=0,z=0,it=0;p<k_order;p++)
							for(var j=0;j<count;j++,it++)
							{
								for(var l=0,m=0;l<k_order;l++)
								{	for(var i=0;i<count;i++,m++,z++)
									{
										var k_temp=ktemp[p][i];
										var df=(-funcs[j](ktemp[p],t_v[p]));
										ktemp[p][i]+=jacobianStep*a_m[p*k_order+l]*step;
										df=(-funcs[j](ktemp[p],t_v[p])-df); 
										df/=jacobianStep;
										if(m==it)
											df+=1.0;
										jacobian_m[z]=df;
										ktemp[p][i]=k_temp;
									}
								}
							}
						}
				}
				for(var j=0,mn=0;j<k_order;j++)
					{
						var a_row_number=j*k_order;
						for(var i=0;i<count;i++)
						{
							var temp=0;
							for(var l=0,v=i;l<k_order;l++,v+=count)
							{
								temp+=a_m[a_row_number+l]*k_v[v];
							}
							ktemp[j][i]=y_old[i]+temp*step;
						}
						for(var i=0;i<count;i++,mn++)
						{
							f[mn]=(-BIGF(k_v[mn],ktemp[j],t_v[j],funcs[i]))
							last_f_difference=Math.max(last_f_difference,Math.abs(f[mn]));
						}
					}
				while(true)
				{
					
					//solve system J(y_new(i))(dy)=-F(y_new(i))
					//y_new(0)=y_old
					var dk;
					if(jacobianConst==true)
					{
						var jacobian_t=jacobian_m.slice();
						dk=gaussSolve(jacobian_t,f);
					}
					else
					{
						{for(var p=0,z=0,it=0;p<k_order;p++)
							for(var j=0;j<count;j++,it++)
							{
								for(var l=0,m=0;l<k_order;l++)
								{	for(var i=0;i<count;i++,m++,z++)
									{
										var k_temp=ktemp[p][i];
										var df=(-funcs[j](ktemp[p],t_v[p]));
										ktemp[p][i]+=jacobianStep*a_m[p*k_order+l]*step;
										df=(-funcs[j](ktemp[p],t_v[p])-df); 
										df/=jacobianStep;
										if(m==it)
											df+=1.0;
										jacobian_m[z]=df;
										ktemp[p][i]=k_temp;
									}
								}
							}
						}
						dk=gaussSolve(jacobian_m,f);
					}
					k_difference=0;//max norm for dy
					for(var i=0;i<count;i++)
					{
						var temp=0;
						for(var j=0;j<k_order;j++)
						{
							var p=j*count+i;
							k_difference=Math.max(Math.abs(dk[p]),k_difference);
							k_v[p]+=dk[p];
							temp+=k_v[p]*b_v[j];
						}
						y[i]=y_old[i]+temp*step;
					}
					k++;
					var f_difference=0;
					for(var j=0,mn=0;j<k_order;j++)
					{
						var a_row_number=j*k_order;
						for(var i=0;i<count;i++)
						{
							var temp=0;
							for(var l=0,v=i;l<k_order;l++,v+=count)
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
					else if(k>=max_iteration)
					{	
						break;//return xv
					}
				}
				if(jacobianConst!=true)
					complexity.rightSideEvaluation+=count*count*2*k_order*k_order*k;
				else
					complexity.rightSideEvaluation+=count*count*2*k_order*k_order;
				complexity.matrixSolving+=k;
				complexity.rightSideEvaluation+=(k+1)*count;
				complexity.currentStep=step;
				complexity.averageStep+=step;
				data.t+=step;
				return;
			}
			function StepAnalytic(data,complexity)
			{
				var count=data.xv.length;
				var f=new Array(k_order*count);
				var y=data.xv.slice();
				var y_old=data.xv.slice();
				var k=0;
				var k_v=new Array(k_order*count);
				for(var i=0;i<k_v.length;i++)
					k_v[i]=0;
				var ktemp=new Array(k_order);
				for(var i=0;i<k_order;i++)
				{
					ktemp[i]=new Array(count);
				}
				var t_v=new Array(k_order);
				for(var i=0;i<k_order;i++)
				{
					t_v[i]=data.t+step*c_v[i];
				}
				var last_f_difference=Number.MAX_VALUE;
				var k_difference=Number.MAX_VALUE;
				var f_difference=0;//max norm for F(y_old+dy)
					
				if(jacobianConst==true)
				{
					for(var p=0,z=0,it=0;p<k_order;p++)
						for(var j=0;j<count;j++,it++)
						{
							for(var l=0,m=0;l<k_order;l++)
							{	for(var i=0;i<count;i++,m++,z++)
								{
									var df=-jacobian[j*count+i](ktemp[p],t_v[p])*a_m[p*k_order+l]*step;
									if(m==it)
										df+=1.0;
									jacobian_m[z]=df;
								}
							}
						}	
				}
				for(var j=0,mn=0;j<k_order;j++)
					{
						var a_row_number=j*k_order;
						for(var i=0;i<count;i++)
						{
							var temp=0;
							for(var l=0,v=i;l<k_order;l++,v+=count)
							{
								temp+=a_m[a_row_number+l]*k_v[v];
							}
							ktemp[j][i]=y_old[i]+temp*step;
						}
						for(var i=0;i<count;i++,mn++)
						{
							f[mn]=(-BIGF(k_v[mn],ktemp[j],t_v[j],funcs[i]))
							last_f_difference=Math.max(last_f_difference,Math.abs(f[mn]));
						}
					}
				while(true)
				{
					
					//solve system J(y_new(i))(dy)=-F(y_new(i))
					//y_new(0)=y_old
					var dk;
					if(jacobianConst==true)
					{
						var jacobian_t=jacobian_m.slice();
						dk=gaussSolve(jacobian_t,f);
					}else
					{
						for(var p=0,z=0,it=0;p<k_order;p++)
							for(var j=0;j<count;j++,it++)
							{
								for(var l=0,m=0;l<k_order;l++)
								{	for(var i=0;i<count;i++,m++,z++)
									{
										var df=-jacobian[j*count+i](ktemp[p],t_v[p])*a_m[p*k_order+l]*step;
										if(m==it)
											df+=1.0;
										jacobian_m[z]=df;
									}
								}
							}
						dk=gaussSolve(jacobian_m,f);
					}
					k_difference=0;//max norm for dy
					for(var i=0;i<count;i++)
					{
						var temp=0;
						for(var j=0;j<k_order;j++)
						{
							var p=j*count+i;
							k_difference=Math.max(Math.abs(dk[p]),k_difference);
							k_v[p]+=dk[p];
							temp+=k_v[p]*b_v[j];
						}
						y[i]=y_old[i]+temp*step;
					}

					var f_difference=0;
					for(var j=0,mn=0;j<k_order;j++)
					{
						var a_row_number=j*k_order;
						for(var i=0;i<count;i++)
						{
							var temp=0;
							for(var l=0,v=i;l<k_order;l++,v+=count)
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
							data.xv[i]=y[i];
						}
						last_f_difference=f_difference;
					}
					k++;
					if(f_difference<0.001)
					{
						break;
					}
					if(k>=max_iteration)
					{	
						break;//return xv
					}
					if(k_difference<0.001)
					{
						break;
					}
					/*for(var j=0,mn=0;j<k_order;j++)
					{
						var a_row_number=j*k_order;
						for(var i=0;i<count;i++)
						{
							var temp=0;
							for(var l=0,v=i;l<k_order;l++,v+=count)
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
					}*/
				}
				complexity.rightSideEvaluation+=(k+1)*count;
				complexity.matrixSolving+=k;
				complexity.currentStep=step;
				complexity.averageStep+=step;
				if(jacobianConst!=true)
					complexity.rightSideEvaluation+=count*count*k_order*k_order*k;
				else
					complexity.rightSideEvaluation+=count*count*k_order*k_order;
				data.t+=step;
				return;
			}
			return {Step:StepNumeric,Init:Init,attributes:{name:'Метод Radau I5'},options:['useJacobian']};
			})();

			/*DIRK=(function()
		{
			function SolveLowTriangular()
			{





			return {,,attributes:{name:"Diagonally implicit RK",options:['useJacobian']}};
		})();*/
		AdamsBashfortMethodFixedStep=(function()
		{
			var step;
			var points=null;
			var maxOrder;
			var counter;
			var funcs;
			var DP=Object.assign({},ExplicitDormandPrince);
			var coefficients=[
			[1],
			[1.5,-0.5],
			[23/12,-4/3,5/12],
			[55/24,-59/24,37/24,-3/8],
			[1901/720,-1387/360,109/30,-637/360,251/720]];
			function Init(options)
			{
				counter=1;
				step=options.step;
				funcs=options.funcsVector;
				maxOrder=options.maxOrder!==undefined?options.maxOrder:5;
				points=new Array(/*maxOrder*funcs.length*/);
				//console.log(maxOrder);
				if(maxOrder==1)
				{
					this.Step=StepGeneral;
					return;
				}
				DP.Init({minStep:step,maxStep:step,step:step,funcsVector:funcs});//метод пятого порядка для получения начальных недостающих игреков

			//console.log(options);
				}
			function StepFirst(data,complexity)
			{
					/*for(var i=0;i<funcs.length;i++)
					{
						points.unshift(funcs[i](data.xv,data.t));
					}*/
					DP.Step(data,complexity);
					counter++;
					if(counter==maxOrder)
					{
						this.Step=StepGeneral;
					}
			}
			function StepGeneral(data,complexity)
			{
				var count=data.xv.length;

				points.splice((maxOrder-1)*count,count);
				//console.log('postsplice: '+points);
				for(var i=0;i<count;i++)
				{
					points.unshift(funcs[i](data.xv,data.t));
				}
				//console.log(points);
				for(var j=0;j<counter;j++)
				{
					for(var i=0;i<count;i++)
						data.xv[i]+=step*points[i+j*count]*coefficients[counter-1][j];
				}
				complexity.rightSideEvaluation+=count;
				complexity.currentStep=step;
				complexity.averageStep+=step;
				data.t+=step;
			}
			return {Step:StepFirst,Init:Init,attributes:{name:"Явные методы Адамса-Башфорта"},options:["chooseOrder"],Orders:[1,2,3,4,5]};	
		})();
		/*AdamsMulton=(function(){


			function Init()
			{


			}
			function StepGeneral()
			{


				
			}




		})();/*
	BackwardDifferentiatinon2=(function(){
		var step=0;
		var funcs;
		var jacobianConst=false;
		var jacobian=null;
		var jacobian_m;
		var counter=0;
		var points=null;
		var maxOrder=;
		function Init(data)
		{
			var count=;
			if(data.order!=undefined)
			{
				maxOrder=data.order;
				points=new Array(maxOrder*(count+1));

			}else
			points=new Array(6*(count+1));//auto order
			//order -1,2,3,4,5,6


		}
		function AutoOrderStep()
		{



		}
		function BIGF(yn_s,yo_s,step_koeff,step,func,yno_v,tn_s)
		{
			return yn_s-yo_s-stepkoeff*step*func(yno_v,tn_s);
		}
		function Step1()
		{
			implicit Euler

		}
		function Step2()
		{
			
			//yn=4/3y(n-1)-1/3y(n-2)+2/3hf(tn,yn)



		}
		function Step3()
		{
			//yn=18/11y(n-1)-9/11y(n-2)+2/11y(n-3)+6/11hf(tn,yn)

		}
		function Step4()
		{
			//yn=48/25y(n-1)-36/25y(n-2)+16/25y(n-3)-3/25y(n-4)+12/25hf(tn,yn)



		}
		function Step5()
		{
			//yn=300/137y(n-1)-300/137y(n-2)+200/137y(n-3)-75/137y(n-4)+12/137y(n-5)+60/137hf(tn,yn)


		}
		function calcPoints6(index)
		{
			return y[][];
		}
		function Step6()
		{
			//yn=360/147y(n-1)-450/147y(n-2)+400/147y(n-3)-225/147y(n-4)+72/147y(n-5)-10/147y(n-6)+60/147hf(tn,yn)



		}
		return{} ;
	})();*/

	/*RadauIIA5=(function(){



		return {};
	})();*/



		return {EulerExplicit:ExplicitEulerMethod,
			ExplicitRalston:ExplicitRalston,
			ExplicitTrapezoidal:ExplicitTrapezoidal,
			ExplicitMidpoint:ExplicitMidpoint,
			ExplicitRK4:ExplicitRK4,
			ExplicitDormandPrince:ExplicitDormandPrince,
			ImplicitEuler:ImplicitEuler,
			ImplicitRadauI5:ImplicitRadauI5,
			AdamsBashfortMethodFixedStep:AdamsBashfortMethodFixedStep
		};
	})();
	
	




}
InitMethods();





/*

Что делать дальше?


Интерфейс выбора методов
Сохранение параметров эксперимент: Параметры задачи плюс параметры методов
Вывод графика ошибки 
графики решения с маркерами
Решить вопрос с ограничением точек
Вывод количества операций, затрат на решение
Возможен вывод жесткости задачи для методов в точках расчёта





*/