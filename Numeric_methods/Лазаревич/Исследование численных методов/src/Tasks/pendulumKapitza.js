var pendulumKapitza={
    taskID:'pendulumKapitza',
    parameters:
    [
    {
        name:"a",
        description:"Амплитуда колебаний осциллятора",
        default:0.2,
        step:0.1,
        min:0,
        max:1000
    }
    ,
    {
        name:"v",
        description:"Частота колебаний осциллятора",
        default:200,
        step:0.1,
        min:0,
        max:1000
    },
    {
        name:"g",
        description:"Ускорение свободного падения",
        default:9.8,
        step:0.1,
        min:0,
        max:1000
    },
    {
        name:"l",
        description:"Длина подвеса маятника",
        default:1,
        step:0.1,
        min:0,
        max:1000
    }
    ],
    variables:
    [
    {
        name:"phi",
        description:"Угол маятника в градусах",
        default:170,
        step:0.1,
        min:0,
        max:360
    },
    {
        name:"phi'",
        description:"Производная угла маятника",
        default:0,
        step:0.1,
        min:-200,
        max:200
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
            description:"Угол"
        },
        description:"График изменения угла"
    },
    {
        x:{
            index:0,
            description:"Угол"
        },
        y:{
            index:1,
            description:"Производная угла"
        },
        description:"Фазовый портрет"
    }
    ],
    taskInfo:
    {
        name:"Маятник Капицы",
        description:`Маятник Капицы описывается дифференциальным уравнением второго порядка для угла подвеса
        <div><img src="./img/kapiza16px.png"/></div>
        <div>Уравнение можно преобразовать к виду </div>
        <div><img src="./img/kapizasecond16px.png"/></div>`
    },
    getFunctions:function getFunctions(parameters)
    {
        var functions=new Array(3);
        var a=parameters[0],v=parameters[1],g=parameters[2],l=parameters[3];
        functions[0]=function(x,t)
        {
            return x[1];
        };
        functions[1]=function(x,t)
        {
            let scale=Math.PI/180.0;
            return -(g+a*v*v*Math.cos(v*t)*Math.sin(x[0]*scale))/(l*scale);
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
        var a=parameters[0],v=parameters[1],g=parameters[2],l=parameters[3];
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
            let scale=Math.PI/180.0;
            return -(g+a*v*v*Math.cos(v*t)*Math.cos(xv[0]*scale))/l;
            },
            function(xv,t)
            {
                return 0;
            }
        ];
        return jacobian;
    }
}
export default pendulumKapitza;