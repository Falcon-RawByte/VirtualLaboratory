


var ExponentEquation={
    taskID:'ExponentEquation',
    parameters:
    [
    {
        name:"lambda",
        description:"Parameter \u03bb",
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
        description:"Value of x",
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
            index:1,
            description:"Time"
        },
        y:{
            index:0,
            description:"Value of x"
        },
        description:"Plot of x"
    }
    ],
    taskInfo:
    {
        name:"Differential Dahlquist's test equation",
        description:`<div>Dahlquist's test equation has a form:</div>
        <div style='margin:0px 40px 20px;'><img src='./img/exponentfirst16px.png'></div>
        <div>Where \u03bb - complex parameter</div>
        <div>The solution of this equation is:</div>
        <div style='margin:0px 40px 20px;'><img src='./img/exponentsecond16px.png'></div>
        <div>Ths solution for starting condition x<sub>0</sub>, t<sub>0</sub>:</div>
        <div style='margin:0px 40px 20px;'><img src='./img/exponentthird16px.png'></div>
        <div>This equation is used in stiff stability analysis.</div>`
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
            }
        ];
        return jacobian;
    }
}
export default ExponentEquation;