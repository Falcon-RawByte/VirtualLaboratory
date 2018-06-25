/*BackwardDifferentiatinon2=(function(){
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