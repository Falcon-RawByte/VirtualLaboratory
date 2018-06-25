import ExplicitRKGeneral from "./ExplicitRKGeneral.js";



class ExplicitRK6_2 extends ExplicitRKGeneral
{
	constructor()
	{
		super();
		this.a=[
		[1/3],
		[0,2/3],
		[1/12,1/3,-1/12],
		[25/48,-55/24,35/48,15/8],
		[3/20,-11/24,-1/8,1/2,1/10],
		[-261/260,33/13,43/156,-118/39,32/195,80/39]];
		this.b=[13/200,0,11/40,11/40,4/25,4/25,13/200];
		this.c=[0,1/3,2/3,1/3,5/6,1/6,1];
		this.stages=7;
	}
}
ExplicitRK6_2.attributes={name:'Explicit Runge-Kutta 6th order method v2'};

export default ExplicitRK6_2;