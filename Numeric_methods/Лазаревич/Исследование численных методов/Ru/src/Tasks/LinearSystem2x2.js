


var LinearSystem2x2={
    taskID:'LinearSystem2x2',
    parameters:
    [
    {
        name:"a11",
        description:"Параметр a11",
        default:-2,
        step:'any',
        min:-100,
        max:100
    },
    {
        name:"a12",
        description:"Параметр a12",
        default:-2,
        step:'any',
        min:-100,
        max:100
    },
    {
        name:"b1",
        description:"Параметр b1",
        default:-2,
        step:'any',
        min:-100,
        max:100
    },
    {
        name:"a21",
        description:"Параметр a21",
        default:-2,
        step:'any',
        min:-100,
        max:100
    },
    {
        name:"a22",
        description:"Параметр a22",
        default:-2,
        step:'any',
        min:-100,
        max:100
    },
    {
        name:"b2",
        description:"Параметр b2",
        default:-2,
        step:'any',
        min:-100,
        max:100
    }
    ],
    variables:
    [
    {
        name:"x1",
        description:"Значение x1",
        default:1,
        step:'any',
        min:-100,
        max:100
    },
    {
        name:"x2",
        description:"Значение x2",
        default:1,
        step:'any',
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
            description:"Значение x1"
        },
        description:"График изменения x1"
    },
    {
        x:{
            index:2,
            description:"Время"
        },
        y:{
            index:1,
            description:"Значение x2"
        },
        description:"График изменения x2"
    },
    {
        x:{
            index:0,
            description:"Значение x1"
        },
        y:{
            index:1,
            description:"Значение x2"
        },
        description:"График x1 x2"
    }
    ],
    taskInfo:
    {
        name:"Линейная система ОДУ с двумя компонентами",
        description:`<p>Линейная система обыкновенных дифференциальных уравнений имеет вид:</p>
        <div><img/>где f(t) - произвольная функция от времени.</div>
        <p>В данном случае рассматривается система:</p>
        <div><img src="./img/linearSystem16px.png"/></div>`
    },
    getFunctions:function getFunctions(parameters)
    {
        var functions=new Array(2);
        functions[0]=function(x,t)
        {
            return parameters[0]*x[0]+parameters[1]*x[1]+parameters[2]*t;
        };
        functions[1]=function(x,t)
        {
            return parameters[3]*x[0]+parameters[4]*x[1]+parameters[5]*t;
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
                return parameters[0];
            },
            function(xv,t)
            {
                return parameters[1];
            },function(xv,t)
            {
                return parameters[3];
            },
            function(xv,t)
            {
                return parameters[4];
            }
        ];
        return jacobian;
    }
}
export default LinearSystem2x2;