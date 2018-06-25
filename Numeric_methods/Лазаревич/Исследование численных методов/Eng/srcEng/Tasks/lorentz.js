var lorentz={
    taskID:'lorentz',
    parameters:
    [
    {
        name:"sigma",
        description:"Parameter \u03c3",
        default:20,
        step:0.1,
        min:0,
        max:1000
    }
    ,
    {
        name:"r",
        description:"Parameter r",
        default:20,
        step:0.1,
        min:0,
        max:1000
    },
    {
        name:"b",
        description:"Parameter b",
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
        description:"Coordinate x",
        default:1,
        step:0.1,
        min:-100,
        max:100
    },
    {
        name:"y",
        description:"Coordinate y",
        default:0,
        step:0.1,
        min:-100,
        max:100
    },
    {
        name:"z",
        description:"Coordinate z",
        default:0,
        step:0.1,
        min:-100,
        max:100
    }],
    argument:
    {
        name:"t",
        description:"Start time",
        plotDescription:'Time',
        default:0,
        step:'any',
        min:0,
        max:10000
    },
    argumentInterval:
    {
        name:"dt",
        description:"Time length",
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
            description:"Value of X"
        },
        y:{
            index:1,
            description:"Value of Y"
        },
        z:{
            index:2,
            description:"Value of Z"
        },
        description:"Plot of coordinates"
    },
    {
        x:{
            index:3,
            description:"Time"
        },
        y:{
            index:0,
            description:"Value of  X"
        },
        description:"Plot of X"
    },
    {
        x:{
            index:3,
            description:"Time"
        },
        y:{
            index:1,
            description:"Value of  Y"
        },
        description:"Plot of Y"
    },
    {
        x:{
            index:3,
            description:"Time"
        },
        y:{
            index:2,
            description:"Value of Z"
        },
        description:"Plot of Z"
    }
    ],
    taskInfo:
    {
        name:"Lorentz system",
        description:`<div>The Lorenz system is a following ODE system:</div>
        <div style='margin:0px 40px 20px;'><img src='./img/lorentz16px.png'></div>
        <div>where x, y, z - coordinates, \u03c3, r, b - constant parameters.</div>`
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
        stepValue:10,
        stepMin:10e-1,
        stepMax:500,
        jacobianAnalythicEnabled:true
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