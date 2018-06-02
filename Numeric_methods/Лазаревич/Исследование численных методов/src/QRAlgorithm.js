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
		var D=(b*b-4.0*c);
		eigenvalues.values[0]=b*0.5;
		eigenvalues.values[1]=b*0.5;
		if(D>0)
		{
			D=Math.sqrt(D);
			eigenvalues.values[0]+=D*0.5;
			eigenvalues.values[1]-=D*0.5;
		}
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
			let r=Math.max(0,k-1);
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
		if(i>0&&Math.abs(A[i*(rank+1)-1])>epsilon*10.0)//complex eigenvalues
		{
			var b=A[(i-1)*rank+i-1]+A[i*(rank)+i];
			var c=A[(i-1)*rank+i-1]*A[i*(rank)+i]-matrix[(i-1)*rank+i]*matrix[i*(rank)+i-1];
			var D=b*b-4.0*c;
			let x1=b*0.5;
			let x2=b*0.5;
			if(D>0)
			{
				D=Math.sqrt(D);
				x1+=D*0.5;
				x2-=D*0.5;
			}
			eigenvalues.values[i-1]=x1;
			eigenvalues.values[i]=x2;
			continue;
		}
		eigenvalues.values[i]=A[i*(rank+1)];
	}
	return eigenvalues;
}

export default QRAlgorithm;