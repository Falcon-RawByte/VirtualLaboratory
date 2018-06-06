


var VanDerPol={
    taskID:'VanDerPol',
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
            index:2,
            description:"Время"
        },
        y:{
            index:1,
            description:"Значение X'"
        },
        description:"График изменения x'"
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
        description:`<div>Осцилятор Ван-дер-Поля описывается дифференциальным уравнением второго порядка:</div>
        <div style='margin:0px 40px 20px;'><img src='./img/vanderpolfull16px.png'></div>
        <div>где \u03bc - параметр</div>
        <div>Приведённое уравнение приводится к системе второго порядка следующим образом:</div>
        <div style='margin:0px 40px 20px;'><img src='./img/vanderpolalt16px.png'></div>`
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
        stepValue:10,
        stepMin:10e-1,
        stepMax:500,
        jacobianAnalythicEnabled:true
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
}
export default VanDerPol;