

var lotkaVolterra={
    taskID:'lotkaVolterra',
    taskInfo:
    {
        name:"Модель Лотки — Вольтерры",
        description:`<div>Модель взаимодействия хищник-жертва</div>
		<div style='margin:0px 40px 20px;'><img src='./img/lotkavolterra16px.png'></div>
		<div>где x - количество жертв, y - количество хищников, \u03b1, \u03b2, \u03b3, \u03b4 - параметры.</div>`
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
        plotDescription:'Время',
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
        stepValue:10,
        stepMin:10e-1,
        stepMax:500,
        jacobianAnalythicEnabled:true
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
            return (parameters[0]-parameters[1]*x[1])*x[0];
        };
        functions[1]=function(x,t)
        {
            return (parameters[3]*x[0]-parameters[2])*x[1];
        };
        return functions;
    },
    getJacobian:function getJacobian(parameters)
    {
    	var jacobian=[
    	function(x,t)
        {
            return (parameters[0]-parameters[1]*x[1]);
        },
    	function(x,t)
        {
            return -parameters[1]*x[0];
        },
    	function(x,t)
        {
            return parameters[3]*x[1];
        },
        function(x,t)
        {
            return (parameters[3]*x[0]-parameters[2]);
        }
    	];
    }
}
export default lotkaVolterra;