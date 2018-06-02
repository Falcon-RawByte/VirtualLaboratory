


var ExponentEquation={
    taskID:'ExponentEquation',
    parameters:
    [
    {
        name:"lambda",
        description:"Параметр \u03bb",
        default:-2,
        step:'any',
        min:-100,
        max:100
    }
    ],
    variables:
    [
    {
        name:"x",
        description:"Значение x",
        default:1,
        step:'any',
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
            index:1,
            description:"Время"
        },
        y:{
            index:0,
            description:"Значение x"
        },
        description:"График изменения x"
    }
    ],
    taskInfo:
    {
        name:"Дифференциальное уравнение экспоненты",
        description:`<div>Дифференциальное уравнение экспоненты имеет вид:</div>
        <div style='margin:0px 40px 20px;'><img src='./img/exponentfirst16px.png'></div>
        <div>где \u03bb - параметр</div>
        <div>Решение данного уравнения в общем виде:</div>
        <div style='margin:0px 40px 20px;'><img src='./img/exponentsecond16px.png'></div>
        <div>Решение уравнения для начального условия x<sub>0</sub>, t<sub>0</sub>:</div>
        <div style='margin:0px 40px 20px;'><img src='./img/exponentthird16px.png'></div>
        <div>Данное уравнение используют для исследования устойчивости численных методов решения дифференциальных уравнений</div>`
    },
    getFunctions:function getFunctions(parameters)
    {
        var functions=new Array(1);
        functions[0]=function(x,t)
        {
            return parameters[0]*x[0];
        };
        return functions;
    },
    getAnalytic:function getAnalytic(parameters,variables,t0)
    {
        var functions=new Array(1);
        functions[0]=function(t)
        {
            return variables[0]*Math.exp(parameters[0]*(t-t0));
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
                return parameters[0];
            }
        ];
        return jacobian;
    }
}
export default ExponentEquation;