import ExplicitRKGeneral from "./ExplicitRKGeneral.js";



class ExplicitRK6_1 extends ExplicitRKGeneral
{
	constructor()
	{
		super();
		this.a=[
			[2/5],
			[0,4/5],
			[169/1458,110/729,-65/1458],
			[-44/675,-88/135,76/351,336/325],
			[21/106,0,-105/689,-324/689,45/106],
			[-2517/4864,-55/38,10615/31616,567/7904,7245/4864,2597/2432]];
		this.b=[0,0,1375/4992,6561/20384,3375/12544,54/768,19/294];
		this.c=[0,2/5,4/5,2/9,8/15,0,1];
		this.stages=7;
	}
}
ExplicitRK6_1.attributes={name:'Метод Рунге-Кутты 6 порядка v1'};

export default ExplicitRK6_1;