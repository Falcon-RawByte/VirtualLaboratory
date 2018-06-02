import VanDerPol from "./Tasks/vanderpoll.js";
import ExponentEquation from "./Tasks/simpleExponent.js";
import lorentz from "./Tasks/lorentz.js";
//import from "./Tasks/2bodyproblem.js";
//import from "./Tasks/3bodyproblem.js";
import LinearSystem2x2 from "./Tasks/LinearSystem2x2.js";
//import from "./Tasks/4orderlinear.js";
import chemistry from "./Tasks/chemistry.js";
import lotkaVolterra from "./Tasks/lotkaVolterra.js";
import pendulumKapitza from "./Tasks/pendulumKapitza.js";




var tasks=[
VanDerPol,
ExponentEquation,
lorentz,
LinearSystem2x2,
chemistry,
lotkaVolterra,
pendulumKapitza
];




/*





var tasks=[
{
    taskID:'task1',
    parameters:
    [
    {
        name:"u",
        description:"Параметр \u03bc",
        default:20,
        step:0.1,
        min:0,
        max:1000
    }
    ],
    mainVariables:
    [
        0
    ],
    variables:
    [
    {
        name:"x",
        description:"Позиция",
        default:1,
        step:0.1,
        min:-100,
        max:100
    },
    {
        name:"x'",
        description:"Скорость",
        default:0,
        step:0.1,
        min:-100,
        max:100
    }],
    argument:
    {
        name:"t",
        description:"Начальное время",
        default:0,
        step:'any',
        min:0,
        max:10000
    },
    argumentInterval:
    {
        name:"dt",
        description:"Продолжительность",
        default:5,
        step:'any',
        min:0,
        max:10000
    },
    plotInfo:
    [
    {
        x:{
            index:2,
            description:"Время"
        },
        y:{
            index:0,
            description:"Значение X"
        },
        description:"График изменения x"
    },
    {
        x:{
            index:0,
            description:"Значение X'"
        },
        y:{
            index:1,
            description:"Значения X'"
        },
        description:"Фазовый портрет"
    }
    ],
    taskInfo:
    {
        name:"Осциллятор Ван-дер-Поля",
        description:"Осцилятор Ван-дер-Поля описывается уравнением "
    },
    getFunctions:function getFunctions(parameters)
    {
        var functions=new Array(2);
        functions[0]=function(x,t)
        {
            return x[1];
        };
        functions[1]=function(x,t)
        {
            var u=parameters[0];
            var x0=x[0];
            var v0=x[1];
            return u*(1-x0*x0)*v0-x0;
        };
        return functions;
    },
    methodsAttributes:
    {
        stepvalue:10,
        stepmin:10e-1,
        stepmax:500
    },
    getJacobian:function getJacobian(parameters)
    {
        var jacobian=
        [
            function(xv,t)
            {
                return 0;
            },
            function(xv,t)
            {   
                return 1;
            },
            function(xv,t)
            {
                var u=parameters[0];
                return -1-2.0*u*xv[0]*xv[1];
            },
            function(xv,t)
            {
                var u=parameters[0];
                var x0=xv[0];
                return u*(1-x0*x0);
            }
        ];
        return jacobian;
    }
},
{
    taskID:'task2',
    parameters:[
    ],
    mainVariables:
    [
        0,1,2,3,4,5,6,7
    ],
    variables:[
    {
        name:"x1",
        description:"Реагент №1",
        default:1,
        step:0.0001,
        min:0,
        max:100
    },
    {
        name:"x2",
        description:"Реагент №2",
        default:0,
        step:0.0001,
        min:0,
        max:100
    },
    {
        name:"x3",
        description:"Реагент №3",
        default:0,
        step:0.0001,
        min:0,
        max:100
    },
    {
        name:"x4",
        description:"Реагент №4",
        default:0,
        step:0.0001,
        min:0,
        max:100
    },
    {
        name:"x5",
        description:"Реагент №5",
        default:0,
        step:0.0001,
        min:0,
        max:100
    },
    {
        name:"x6",
        description:"Реагент №6",
        default:0,
        step:0.0001,
        min:0,
        max:100
    },
    {
        name:"x7",
        description:"Реагент №7",
        default:0.0057,
        step:0.0001,
        min:0,
        max:100
    },
    {
        name:"x8",
        description:"Реагент №8",
        default:1,
        step:0.0001,
        min:0,
        max:100
    }],
    argument:
    {
        name:"t",
        description:"Начальное время",
        default:0,
        step:1,
        min:0,
        max:100
    },
    argumentInterval:
    {
        name:"dt",
        description:"Продолжительность",
        default:10,
        step:1,
        min:0,
        max:100
    }
    ,
    plotInfo:[
    {
        x:{
            index:8,
            description:"Время"
        },
        y:{
            index:0,
            description:"Значение X1"
        },
        description:"График изменения x1"
    },
    {
        x:{
            index:8,
            description:"Время"
        },
        y:{
            index:1,
            description:"Значения X2"
        },
        description:"График изменения x2"
    },
    {
        x:{
            index:8,
            description:"Время"
        },
        y:{
            index:2,
            description:"Значения X3"
        },
        description:"График изменения x3"
    },
    {
        x:{
            index:8,
            description:"Время"
        },
        y:{
            index:3,
            description:"Значения X4"
        },
        description:"График изменения x4"
    },
    {
        x:{
            index:8,
            description:"Время"
        },
        y:{
            index:4,
            description:"Значения X5"
        },
        description:"График изменения x5"
    },
    {
        x:{
            index:8,
            description:"Время"
        },
        y:{
            index:5,
            description:"Значения X6"
        },
        description:"График изменения x6"
    },
    {
        x:{
            index:8,
            description:"Время"
        },
        y:{
            index:6,
            description:"Значения X7"
        },
        description:"График изменения x7"
    },
    {
        x:{
            index:8,
            description:"Время"
        },
        y:{
            index:7,
            description:"Значения X8"
        },
        description:"График изменения x8"
    }
    ],
    taskInfo:
    {
        name:"Превращения восьми реагентов",
        description:"<p>Данная система ОДУ описывает превращения восьми реагентов.</p><p>Она имеет следующий вид:</p><div style='margin:0px 40px 20px;'><img src='./img/chemistryFormulas16px.png'></div>"
    },

    getFunctions:function getFunctions(parameters)
    {
        var functions=new Array(8);
        functions[0]=function(x,t)
        {
            return -1.71*x[0]+0.43*x[1]+8.32*x[2]+0.0007;
        };
        functions[1]=function(x,t)
        {
            return 1.71*x[0]-8.75*x[1];
        };
        functions[2]=function(x,t)
        {
            return -10.03*x[2]+0.43*x[3]+0.035*x[4];
        };
        functions[3]=function(x,t)
        {
            return 8.32*x[1]+1.71*x[2]-1.12*x[3];
        };
        functions[4]=function(x,t)
        {
            return -1.745*x[4]+0.43*x[5]+0.43*x[6];
        };
        functions[5]=function(x,t)
        {
            return -280*x[5]*x[7]+0.69*x[3]+1.71*x[4]-0.43*x[5]+0.69*x[6];
        };
        functions[6]=function(x,t)
        {
            return 280*x[5]*x[7]-1.81*x[6];
        };
        functions[7]=function(x,t)
        {
            return -280*x[5]*x[7]+1.81*x[6];
        };
        return functions;
    }
},
{
    taskID:'preyPredator',
    taskInfo:
    {
        name:"Модель Лотки — Вольтерры",
        description:"Модель взаимодействия хищник-жертва"
    },
    parameters:
    [
    {
        name:"a",
        description:"Параметр \u03b1",
        default:1,
        step:'any',
        min:0,
        max:10
    },
    {
        name:"b",
        description:"Параметр \u03b2",
        default:1,
        step:'any',
        min:0,
        max:10
    },
    {
        name:"g",
        description:"Параметр \u03b3",
        default:1,
        step:'any',
        min:0,
        max:10
    },
    {
        name:"d",
        description:"Параметр \u03b4",
        default:1,
        step:'any',
        min:0,
        max:10
    }
    ],
    variables:
    [
    {
        name:"x",
        description:"Начальное число жертв",
        default:10,
        step:'any',
        min:0,
        max:1000
    },
    {
        name:"y",
        description:"Начальная число хищников",
        default:10,
        step:'any',
        min:0,
        max:1000
    }],
    argument:
    {
        name:"t",
        description:"Начальное время",
        default:0,
        step:'any',
        min:0,
        max:10000
    },
    argumentInterval:
    {
        name:"dt",
        description:"Продолжительность",
        default:5,
        step:'any',
        min:0,
        max:10000
    },
    methodsAttributes:
    {
        stepvalue:10,
        stepmin:10e-1,
        stepmax:500
    },
    plotInfo:
    [
    {
        x:{
            index:2,
            description:"Время"
        },
        y:{
            index:0,
            description:"Значение X"
        },
        description:"График изменения количества жертв"
    },
    {
        x:{
            index:2,
            description:"Время"
        },
        y:{
            index:1,
            description:"Значение Y"
        },
        description:"График изменения количества хищников"
    },
    {
        x:{
            index:0,
            description:"Значение X"
        },
        y:{
            index:1,
            description:"Значения Y"
        },
        description:"Фазовый портрет"
    }
    ],
    getFunctions:function getFunctions(parameters)
    {
        var functions=new Array(2);
        functions[0]=function(x,t)
        {
            return (parameters[0]-parameters[1]*x[0])*x[0];
        };
        functions[1]=function(x,t)
        {
            return (parameters[3]*x[0]-parameters[2])*x[1];
        };
        return functions;
    }
}];

*/
module.exports=tasks;

/*

"functions":[
 "-1.71*xv[0]+0.43*xv[1]+8.32*xv[2]+0.0007",
 "1.71*xv[0]-8.75*xv[1]",
 "-10.03*xv[2]+0.43*xv[3]+0.035*xv[4]",
 "8.32*xv[1]+1.71*xv[2]-1.12*xv[3]",
 "-1.745*xv[4]+0.43*xv[5]+0.43*xv[6]",
 "-280*xv[5]*xv[7]+0.69*xv[3]+1.71*xv[4]-0.43*xv[5]+0.69*xv[6]",
 "280*xv[5]*xv[7]-1.81*xv[6]",
 "-280*xv[5]*xv[7]+1.81*xv[6]"
 ]*/
/*

:[
    {
		"parameters":[
            {
                "name":"u",
                "description":"Параметр \u03bc",
                "default":20,
                "step":"0.1"
            }],
	    "values":[
            {
                "name":"x",
                "description":"Начальная позиция",
                "default":1
            },
            {
                "name":"x'",
                "description":"Начальная скорость",
                "default":0
            }],
		"argument":[
            {
                "name":"t",
                "description":"Начальное время",
                "default":0
            },
            {
                "name":"dt",
                "description":"Продолжительность",
                "default":10,
                "min":0
            }],
		"plot":[
            {
                "x":{
                    "index":2,
                    "description":"Время"
                    },
                "y":{
                    "index":0,
                    "description":"Значение X"
                    },
                "description":"График изменения x"
            },
            {
                "x":{
                    "index":0,
                    "description":"Значение X'"
                    },
                "y":{
                    "index":1,
                    "description":"Значения X'"
                    },
                "description":"Фазовый портрет"
            }],
        "taskInfo":
        {
            "name":"Осциллятор Ван-дер-Поля",
            "description":"Осцилятор Ван-дер-Поля описывается уравнением "
        },
		"functions":[
            "xv[1]",
            "u*(1-xv[0]*xv[0])*v0-xv[0]"
        ]
    },
    {
        "parameters":[
        ],
        "values":[
            {
                "name":"y1",
                "description":"Реагент №1",
                "default":1
            },
            {
                "name":"y2",
                "description":"Реагент №2",
                "default":0
            },
            {
                "name":"y3",
                "description":"Реагент №3",
                "default":0
            },
            {
                "name":"y4",
                "description":"Реагент №4",
                "default":0
            },
            {
                "name":"y5",
                "description":"Реагент №5",
                "default":0
            },
            {
                "name":"y6",
                "description":"Реагент №6",
                "default":0
            },
            {
                "name":"y7",
                "description":"Реагент №7",
                "default":0.0057
            },
            {
                "name":"y8",
                "description":"Реагент №8",
                "default":1
            }],
        "argument":[
            {
                "name":"t",
                "description":"Начальное время",
                "default":0,
                "min":0
            },
            {
                "name":"t",
                "description":"Продолжительность",
                "default":10,
                "min":0
            }],
        "plot":[

        ],
        "taskInfo":
        {
            "name":"Превращения восьми реагентов",
            "description":"Данная система ОДУ описывает превращения восьми реагентов.<br>Она имеет следующий вид:<br> add some Latex"
        },

        "functions":[
         "-1.71*xv[0]+0.43*xv[1]+8.32*xv[2]+0.0007",
         "1.71*xv[0]-8.75*xv[1]",
         "-10.03*xv[2]+0.43*xv[3]+0.035*xv[4]",
         "8.32*xv[1]+1.71*xv[2]-1.12*xv[3]",
         "-1.745*xv[4]+0.43*xv[5]+0.43*xv[6]",
         "-280*xv[5]*xv[7]+0.69*xv[3]+1.71*xv[4]-0.43*xv[5]+0.69*xv[6]",
         "280*xv[5]*xv[7]-1.81*xv[6]",
         "-280*xv[5]*xv[7]+1.81*xv[6]"
        ]
    }

]
}


		{
			var parameters=[{name:'u',description:'Параметр \u03bc',default:20,step:'0.1'}];
			var values=[{name:'x',description:'Начальная позиция',default:1},{name:"x'",description:'Начальная скорость',default:0}];//x,x'
			var argument=[{name:'t',description:'Начальное время',default:0},{name:'dt',description:'Продолжительность',default:10,min:0}];
			//var plot=[{x:'t',y:'x'},{x:'x',y:"x'"}];
			var plot=[{x:{index:values.length,description:'Время'},y:{index:0,description:'Значение X'},description:'График изменения x'},{x:{index:0,description:'Значение X'},y:{index:1,description:"Значения X'"},description:'Фазовый портрет'}];
			var taskInfo={name:'Осциллятор Ван-дер-Поля',description:'Здесь должно быть описание задачи'};
			function getFunctions(parameters)
			{
				var functions=new Array(2);
				functions[0]=function(x,t)
				{
					return x[1];
				};
				functions[1]=function(x,t)
				{
					var u=parameters[0];
					var x0=x[0];
					var v0=x[1];
					return u*(1-x0*x0)*v0-x0;
				};
				return functions;
			}
			function getJacobian(parameters)
			{
				var jacobian=
				[
					function(xv,t)
					{
						return 0;
					},
					function(xv,t)
					{	
						return 1;
					}
					,
					function(xv,t)
					{
						var u=parameters[0];
						return -1-2.0*u*xv[0]*xv[1];
					},
					function(xv,t)
					{
						var u=parameters[0];
						var x0=xv[0];
						return u*(1-x0*x0);
					}
				];
				return jacobian;
			};
				return {parameters:parameters,values:values,argument:argument,plot:plot,getFunctions:getFunctions,getJacobian:getJacobian};
			})();*/