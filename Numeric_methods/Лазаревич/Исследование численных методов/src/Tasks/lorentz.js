var lorentz={
    taskID:'lorentz',
    parameters:
    [
    {
        name:"sigma",
        description:"Параметр \u03c3",
        default:20,
        step:0.1,
        min:0,
        max:1000
    }
    ,
    {
        name:"r",
        description:"Параметр r",
        default:20,
        step:0.1,
        min:0,
        max:1000
    },
    {
        name:"b",
        description:"Параметр b",
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
        description:"Координата x",
        default:1,
        step:0.1,
        min:-100,
        max:100
    },
    {
        name:"y",
        description:"Координата y",
        default:0,
        step:0.1,
        min:-100,
        max:100
    },
    {
        name:"z",
        description:"Координата z",
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
            index:0,
            description:"Значение X"
        },
        y:{
            index:1,
            description:"Значение Y"
        },
        z:{
            index:2,
            description:"Значение Z"
        },
        description:"График изменения координат"
    },
    {
        x:{
            index:3,
            description:"Время"
        },
        y:{
            index:0,
            description:"Значения X"
        },
        description:"График координаты X"
    },
    {
        x:{
            index:3,
            description:"Время"
        },
        y:{
            index:1,
            description:"Значения Y"
        },
        description:"График координаты Y"
    },
    {
        x:{
            index:3,
            description:"Время"
        },
        y:{
            index:2,
            description:"Значения Z"
        },
        description:"График координаты Z"
    }
    ],
    taskInfo:
    {
        name:"Аттрактор Лоренца",
        description:``
    },
    getFunctions:function getFunctions(parameters)
    {
        var functions=new Array(3);
        var s=parameters[0],r=parameters[1],b=parameters[2];
        functions[0]=function(x,t)
        {
            return s*(x[1]-x[0]);
        };
        functions[1]=function(x,t)
        {
            return x[0]*(r-x[2])-x[1];
        };
        functions[2]=function(x,t)
        {
            return x[0]*x[1]-b*x[2];
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
        var s=parameters[0],r=parameters[1],b=parameters[2];
        var jacobian=
        [
            function(xv,t)
            {
                return -s;
            },
            function(xv,t)
            {   
                return r-xv[2];
            },
            function(xv,t)
            {
                return xv[1];
            },
            function(xv,t)
            {
                return s;
            },
            function(xv,t)
            {   
                return -1;
            },
            function(xv,t)
            {
                return xv[0];
            },
            function(xv,t)
            {
                return 0;
            },
            function(xv,t)
            {   
                return -xv[0];
            },
            function(xv,t)
            {
                return -b;
            }
        ];
        return jacobian;
    }
}

export default lorentz;