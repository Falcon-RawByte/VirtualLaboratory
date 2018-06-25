


var chemistry={
    taskID:'chemistry',
    parameters:[
    ],
    mainVariables:
    [
        0,1,2,3,4,5,6,7
    ],
    variables:[
    {
        name:"x1",
        description:"Reactant №1",
        default:1,
        step:0.0001,
        min:0,
        max:100
    },
    {
        name:"x2",
        description:"Reactant №2",
        default:0,
        step:0.0001,
        min:0,
        max:100
    },
    {
        name:"x3",
        description:"Reactant №3",
        default:0,
        step:0.0001,
        min:0,
        max:100
    },
    {
        name:"x4",
        description:"Reactant №4",
        default:0,
        step:0.0001,
        min:0,
        max:100
    },
    {
        name:"x5",
        description:"Reactant №5",
        default:0,
        step:0.0001,
        min:0,
        max:100
    },
    {
        name:"x6",
        description:"Reactant №6",
        default:0,
        step:0.0001,
        min:0,
        max:100
    },
    {
        name:"x7",
        description:"Reactant №7",
        default:0.0057,
        step:0.0001,
        min:0,
        max:100
    },
    {
        name:"x8",
        description:"Reactant №8",
        default:1,
        step:0.0001,
        min:0,
        max:100
    }],
    argument:
    {
        name:"t",
        description:"Start time",
        plotDescription:'Time',
        default:0,
        step:1,
        min:0,
        max:100
    },
    argumentInterval:
    {
        name:"dt",
        description:"Time length",
        default:10,
        step:1,
        min:0,
        max:100
    }
    ,
    plotInfo:[
    {
        x:{
            index:8,
            description:"Time"
        },
        y:{
            index:0,
            description:"Value of X1"
        },
        description:"Plot of x1"
    },
    {
        x:{
            index:8,
            description:"Time"
        },
        y:{
            index:1,
            description:"Value of X2"
        },
        description:"Plot of x2"
    },
    {
        x:{
            index:8,
            description:"Time"
        },
        y:{
            index:2,
            description:"Value of X3"
        },
        description:"Plot of x3"
    },
    {
        x:{
            index:8,
            description:"Time"
        },
        y:{
            index:3,
            description:"Value of X4"
        },
        description:"Plot of x4"
    },
    {
        x:{
            index:8,
            description:"Time"
        },
        y:{
            index:4,
            description:"Value of X5"
        },
        description:"Plot of x5"
    },
    {
        x:{
            index:8,
            description:"Time"
        },
        y:{
            index:5,
            description:"Value of X6"
        },
        description:"Plot of x6"
    },
    {
        x:{
            index:8,
            description:"Time"
        },
        y:{
            index:6,
            description:"Value of X7"
        },
        description:"Plot of x7"
    },
    {
        x:{
            index:8,
            description:"Time"
        },
        y:{
            index:7,
            description:"Value of X8"
        },
        description:"Plot of x8"
    }
    ],
    taskInfo:
    {
        name:"The chemical reaction with 8 reactants",
        description:`<div>This ODE system describes chemical reaction involving eight reactants.</div>
        <div>The system is:</div>
        <div style='margin:0px 40px 20px;'><img src='./img/chemistryFormulas16px.png'></div>
        <div>Where x<sub>i</sub> - concentration of i-th reactant.</div>`
    },
    methodsAttributes:
    {
        stepValue:10,
        stepMin:10e-1,
        stepMax:500,
        jacobianAnalythicEnabled:false
    },
    getFunctions:function getFunctions(parameters)
    {
        var functions=new Array(8);
        functions[0]=function(x,t)
        {
            return -1.71*x[0]+0.43*x[1]+8.32*x[2]+0.0007;
        };
        functions[1]=function(x,t)
        {
            return 1.71*x[0]-8.75*x[1];
        };
        functions[2]=function(x,t)
        {
            return -10.03*x[2]+0.43*x[3]+0.035*x[4];
        };
        functions[3]=function(x,t)
        {
            return 8.32*x[1]+1.71*x[2]-1.12*x[3];
        };
        functions[4]=function(x,t)
        {
            return -1.745*x[4]+0.43*x[5]+0.43*x[6];
        };
        functions[5]=function(x,t)
        {
            return -280*x[5]*x[7]+0.69*x[3]+1.71*x[4]-0.43*x[5]+0.69*x[6];
        };
        functions[6]=function(x,t)
        {
            return 280*x[5]*x[7]-1.81*x[6];
        };
        functions[7]=function(x,t)
        {
            return -280*x[5]*x[7]+1.81*x[6];
        };
        return functions;
    }
}
export default chemistry;