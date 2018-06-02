import ExplicitEulerMethod from "./Methods/ExplicitEuler.js";
import ExplicitRalston from "./Methods/ExplicitRalston.js";
import ExplicitTrapezoidal from "./Methods/ExplicitTrapezoidal.js";
import ExplicitMidpoint from "./Methods/ExplicitMidpoint.js";
import ExplicitRK4 from "./Methods/ExplicitRK4.js";
import ExplicitDormandPrince from "./Methods/ExplicitDormandPrince.js";
import ImplicitEuler from "./Methods/ImplicitEuler.js";
import ImplicitRadauI5 from "./Methods/ImplicitRadauI5.js";
import AdamsBashfortMethodFixedStep from "./Methods/AdamsBashfortMethodFixedStep.js";

var Methods;

var InitMethods=function(){
	
		//https://www.inf.ethz.ch/personal/gander/papers/qrneu.pdf
		//http://people.inf.ethz.ch/arbenz/ewp/Lnotes/chapter4.pdf
	Methods=(function()
	{
			/*DIRK=(function()
		{
			function SolveLowTriangular()
			{





			return {,,attributes:{name:"Diagonally implicit RK",options:['useJacobian']}};
		})();*/
	/*RadauIIA5=(function(){



		return {};
	})();*/
		return [
			ExplicitEulerMethod,
			ExplicitRalston,
			ExplicitTrapezoidal,
			ExplicitMidpoint,
			ExplicitRK4,
			ExplicitDormandPrince,
			ImplicitEuler,
			ImplicitRadauI5,
			AdamsBashfortMethodFixedStep
		];
	})();
}
InitMethods();

export {Methods};


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