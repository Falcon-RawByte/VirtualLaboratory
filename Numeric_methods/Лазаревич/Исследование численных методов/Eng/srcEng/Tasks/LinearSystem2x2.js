


var LinearSystem2x2={
    taskID:'LinearSystem2x2',
    parameters:
    [
    {
        name:"a11",
        description:"Parameter a11",
        default:-2,
        step:'any',
        min:-100,
        max:100
    },
    {
        name:"a12",
        description:"Parameter a12",
        default:-2,
        step:'any',
        min:-100,
        max:100
    },
    {
        name:"b1",
        description:"Parameter b1",
        default:-2,
        step:'any',
        min:-100,
        max:100
    },
    {
        name:"a21",
        description:"Parameter a21",
        default:-2,
        step:'any',
        min:-100,
        max:100
    },
    {
        name:"a22",
        description:"Parameter a22",
        default:-2,
        step:'any',
        min:-100,
        max:100
    },
    {
        name:"b2",
        description:"Parameter b2",
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
        description:"Parameter x1",
        default:1,
        step:'any',
        min:-100,
        max:100
    },
    {
        name:"x2",
        description:"Parameter x2",
        default:1,
        step:'any',
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
            index:2,
            description:"Time"
        },
        y:{
            index:0,
            description:"Value of x1"
        },
        description:"Plot of x1"
    },
    {
        x:{
            index:2,
            description:"Time"
        },
        y:{
            index:1,
            description:"Value of x2"
        },
        description:"Plot of x2"
    },
    {
        x:{
            index:0,
            description:"Value of x1"
        },
        y:{
            index:1,
            description:"Value of x2"
        },
        description:"Plot of x1 and x2"
    }
    ],
    taskInfo:
    {
        name:"Linear ODE system with two components",
        description:`<p>Linear ODE system has a form:</p>
        <div><img/>Where f(t) - some function of time</div>
        <p>In this particular case the followin system is presented:</p>
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