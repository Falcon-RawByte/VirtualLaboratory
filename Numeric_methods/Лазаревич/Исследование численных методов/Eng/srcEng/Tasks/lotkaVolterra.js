

var lotkaVolterra={
    taskID:'lotkaVolterra',
    taskInfo:
    {
        name:"Lotka-Volterra equations",
        description:`<div>Lotka-Volterra equations are a pair of differential equations, describing the predator-prey population dynamic:</div>
		<div style='margin:0px 40px 20px;'><img src='./img/lotkavolterra16px.png'></div>
		<div>Where x - numer of prey, y - number of predator, \u03b1, \u03b2, \u03b3, \u03b4 - parameters.</div>`
    },
    parameters:
    [
    {
        name:"a",
        description:"Parameter \u03b1",
        default:1,
        step:'any',
        min:0,
        max:10
    },
    {
        name:"b",
        description:"Parameter \u03b2",
        default:1,
        step:'any',
        min:0,
        max:10
    },
    {
        name:"g",
        description:"Parameter \u03b3",
        default:1,
        step:'any',
        min:0,
        max:10
    },
    {
        name:"d",
        description:"Parameter \u03b4",
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
        description:"Initial number of preys",
        default:10,
        step:'any',
        min:0,
        max:1000
    },
    {
        name:"y",
        description:"Initial number of predators",
        default:10,
        step:'any',
        min:0,
        max:1000
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
            description:"Time"
        },
        y:{
            index:0,
            description:"Value of X"
        },
        description:"Plot of number of preys"
    },
    {
        x:{
            index:2,
            description:"Время"
        },
        y:{
            index:1,
            description:"Value of Y"
        },
        description:"Plot of number of predators"
    },
    {
        x:{
            index:0,
            description:"Value of X"
        },
        y:{
            index:1,
            description:"Value of Y"
        },
        description:"Phase portrait"
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