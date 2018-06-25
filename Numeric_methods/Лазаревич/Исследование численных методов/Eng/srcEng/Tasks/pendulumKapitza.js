var pendulumKapitza={
    taskID:'pendulumKapitza',
    parameters:
    [
    {
        name:"a",
        description:"Oscillation amplitude",
        default:0.2,
        step:0.1,
        min:0,
        max:1000
    }
    ,
    {
        name:"v",
        description:"Oscillation frequency",
        default:200,
        step:0.1,
        min:0,
        max:1000
    },
    {
        name:"g",
        description:"Free-fall acceleration",
        default:9.8,
        step:0.1,
        min:0,
        max:1000
    },
    {
        name:"l",
        description:"Length of pendulum",
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
        description:"Pendulum angle (degrees)",
        default:170,
        step:0.1,
        min:0,
        max:360
    },
    {
        name:"phi'",
        description:"Derivative of angle",
        default:0,
        step:0.1,
        min:-200,
        max:200
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
            description:"Angle"
        },
        description:"Angle plot"
    },
    {
        x:{
            index:0,
            description:"Angle"
        },
        y:{
            index:1,
            description:"Angle derivative"
        },
        description:"Phase portrait"
    }
    ],
    taskInfo:
    {
        name:"Kapitza's pendulum",
        description:`Kapitza's pendulum is described by second order differential equation for angle between pendulum and downward direction
        <div><img src="./img/kapiza16px.png"/></div>
        <div>This equation can be transformed into a first order ODE system the following way</div>
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
        stepValue:10,
        stepMin:10e-1,
        stepMax:500,
        jacobianAnalythicEnabled:true
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