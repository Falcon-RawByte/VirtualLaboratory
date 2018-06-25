


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
        description:"Реагент №1",
        default:1,
        step:0.0001,
        min:0,
        max:100
    },
    {
        name:"x2",
        description:"Реагент №2",
        default:0,
        step:0.0001,
        min:0,
        max:100
    },
    {
        name:"x3",
        description:"Реагент №3",
        default:0,
        step:0.0001,
        min:0,
        max:100
    },
    {
        name:"x4",
        description:"Реагент №4",
        default:0,
        step:0.0001,
        min:0,
        max:100
    },
    {
        name:"x5",
        description:"Реагент №5",
        default:0,
        step:0.0001,
        min:0,
        max:100
    },
    {
        name:"x6",
        description:"Реагент №6",
        default:0,
        step:0.0001,
        min:0,
        max:100
    },
    {
        name:"x7",
        description:"Реагент №7",
        default:0.0057,
        step:0.0001,
        min:0,
        max:100
    },
    {
        name:"x8",
        description:"Реагент №8",
        default:1,
        step:0.0001,
        min:0,
        max:100
    }],
    argument:
    {
        name:"t",
        description:"Начальное время",
        plotDescription:'Время',
        default:0,
        step:1,
        min:0,
        max:100
    },
    argumentInterval:
    {
        name:"dt",
        description:"Продолжительность",
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
            description:"Время"
        },
        y:{
            index:0,
            description:"Значение X1"
        },
        description:"График изменения x1"
    },
    {
        x:{
            index:8,
            description:"Время"
        },
        y:{
            index:1,
            description:"Значения X2"
        },
        description:"График изменения x2"
    },
    {
        x:{
            index:8,
            description:"Время"
        },
        y:{
            index:2,
            description:"Значения X3"
        },
        description:"График изменения x3"
    },
    {
        x:{
            index:8,
            description:"Время"
        },
        y:{
            index:3,
            description:"Значения X4"
        },
        description:"График изменения x4"
    },
    {
        x:{
            index:8,
            description:"Время"
        },
        y:{
            index:4,
            description:"Значения X5"
        },
        description:"График изменения x5"
    },
    {
        x:{
            index:8,
            description:"Время"
        },
        y:{
            index:5,
            description:"Значения X6"
        },
        description:"График изменения x6"
    },
    {
        x:{
            index:8,
            description:"Время"
        },
        y:{
            index:6,
            description:"Значения X7"
        },
        description:"График изменения x7"
    },
    {
        x:{
            index:8,
            description:"Время"
        },
        y:{
            index:7,
            description:"Значения X8"
        },
        description:"График изменения x8"
    }
    ],
    taskInfo:
    {
        name:"Превращения восьми реагентов",
        description:`<div>Данная система ОДУ описывает превращения восьми реагентов.</div>
        <div>Она имеет следующий вид:</div>
        <div style='margin:0px 40px 20px;'><img src='./img/chemistryFormulas16px.png'></div>
        <div>где x<sub>i</sub> - концентрация i-го реагента</div>`
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