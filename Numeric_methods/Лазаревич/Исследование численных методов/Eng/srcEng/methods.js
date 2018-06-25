import ExplicitEulerMethod from "./Methods/ExplicitEuler.js";
import ExplicitRalston from "./Methods/ExplicitRalston.js";
import ExplicitTrapezoidal from "./Methods/ExplicitTrapezoidal.js";
import ExplicitMidpoint from "./Methods/ExplicitMidpoint.js";
import ExplicitRK4 from "./Methods/ExplicitRK4.js";
import ExplicitRK6_1 from "./Methods/ExplicitRK6_1.js";
import ExplicitRK6_2 from "./Methods/ExplicitRK6_2.js";
import ExplicitDormandPrince from "./Methods/ExplicitDormandPrince.js";
import ImplicitEuler from "./Methods/ImplicitEuler.js";
import ImplicitRadauIA5 from "./Methods/ImplicitRadauIA5.js";
import AdamsBashfort from "./Methods/AdamsBashfort.js";
import ImplicitLobatto3C from "./Methods/ImplicitLobatto3C.js";
import BackwardDifferentiationFormulas from "./Methods/BackwardDifferentiationFormulas.js";
import AdamsMulton from "./Methods/AdamsMulton.js";

var Methods;

var InitMethods=function(){
	
		//https://www.inf.ethz.ch/personal/gander/papers/qrneu.pdf
		//http://people.inf.ethz.ch/arbenz/ewp/Lnotes/chapter4.pdf
	Methods=(function()
	{
		return [
			ExplicitEulerMethod,
			ExplicitRalston,
			ExplicitTrapezoidal,
			ExplicitMidpoint,
			ExplicitRK4,
			ExplicitRK6_1,
			ExplicitRK6_2,
			ExplicitDormandPrince,
			ImplicitEuler,
			ImplicitRadauIA5,
			ImplicitLobatto3C,
			AdamsBashfort,
			BackwardDifferentiationFormulas,
			AdamsMulton
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