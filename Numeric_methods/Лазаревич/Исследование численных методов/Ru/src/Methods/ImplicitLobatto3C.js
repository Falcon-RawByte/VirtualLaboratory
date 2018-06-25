import ImplicitRungeKuttaGeneral from "./ImplicitRungeKuttaGeneral.js";

class ImplicitLobatto3C extends ImplicitRungeKuttaGeneral
{
	constructor()
	{
		super();
		let root=Math.sqrt(5);
		this.a_m=[
		1/12,-root/12,root/12,-1/12,
		1/12,0.25,(10-7*root)/60,root/60,
		1/12,(10+7*root)/60,1/4,-root/60,
		1/12,5/12,5/12,1/12,
		];
		this.b_v=[1/12,5/12,5/12,1/12];
		this.c_v=[0,(0.5-0.1*root),(0.5+0.1*root),1];
		this.k_order=4;
	}
}

ImplicitLobatto3C.attributes={name:'Метод Lobatto IIIC 6 порядка'};
ImplicitLobatto3C.options=['jacobianMatrixEnabled'];

export default ImplicitLobatto3C;