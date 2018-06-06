import ExplicitRKGeneral from "./ExplicitRKGeneral.js";



class ExplicitRK8
{
	constructor()
	{
		super();
		var root=Math.sqrt(21);
		this.a=[
			[1/2],
			[1/4,1/4],
			[1/7,(-7-3*root)/98,0,(21+5*root)/49],
			[(11+root)/84,0,(18+4*root)/63,(21-root)/252],
			[(5+root)/48,0,(9+root)/36,(-231+14*root)/360,(63-7*root)/80],
			[(10-root)/42,0,(-432+92*root)/315,(633-145*root)/90,(-503+115*root)/70,(63-13*root)/35],
			[1/14,0,0,0,(14-3*root)/126,(13-3*root)/63,1/9],
			[1/32,0,0,0,(91-21*root)/576,11/72,(-385-75*root)/1152,(63+13*root)/128],
			[1/14,0,0,0,1/9,(-733-147*root)/2205,(515+111*root)/504,(-51-11*root)/56,(132+28*root)/245],
			[0,0,0,0,(-42+7*root)/18,(-18+28*root)/45,(-27353*root)/72,(301+53*root)/72,(28-28*root)/72,(49-7*root)/18]];
		this.b=[1/20,0,0,0,0,0,0,49/180,16/45,49/180,1/20];
		this.c=[0,1/2,1/2,(7+root)/14,(7+root)/14,1/2,(7-root)/14,
		(7-root)/14,1/2,(7+root)/14,1];
		this.stages=11;
	}
}
ExplicitRK6_1.attributes={name:'Метод Рунге-Кутты 8 порядка'};

export default ExplicitRK6_1;