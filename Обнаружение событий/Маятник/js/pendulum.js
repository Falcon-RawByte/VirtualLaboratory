var Plot = "Plotly";
var width = 0;
var height = 450;

var iterationCounter = 0;
var animating = false;
var stopped = false;
var approximate;

var origin = {x:0, y:10};
var angle;
var da;
var length;
var gravity;
var blockAngles = [];
var snapped = false;
var xBall;
var yBall;



window.toggleDemo = function()
{
  if (stopped)
  {
    startDemo();
    document.getElementById('DemoButton').innerText = "Остановить моделирование";
  }
  else
  {
    stopDemo();
    document.getElementById('DemoButton').innerText = "Начать Моделирование";
  }
}

window.stopDemo=function()
{
  stopped = true;
  clearInterval(window.interval);
  document.getElementById('DemoButton').innerText = "Начать Моделирование";
}

window.onload = window.onresize = function() {
    cv = document.getElementById('Plotly');
    
    var w = window.getComputedStyle(cv).width.replace("px", "");
    width = parseInt(w);
    
    CreatePlot();
}

function CreatePlot()
{
  var Origin = {
    x : [0, 5, -1],
    y : [10, 5, 8],
    mode: 'markers',
    marker: { size: 12 },
    type: 'scatter',
    name: 'Подвес'
  }

  var pendulum = {
    x : [0],
    y : [0],
    name: '???'
  }

  var trace = {
    x : [0],
    y : [0],
    name: 'Траектория полёта'
  };

  var a = 12 * width/height;

  var layout = {
    xaxis: {
      range: [ -a/2, a/2]
    },
    yaxis: {
      range: [0, 10]
    }
  };

  var data = [pendulum, trace, Origin];
  Plotly.plot(Plot, data, layout);
}

function RecreatePlot()
{
  var xy = polarToCartesian(origin, angle, length);
  var trace = {
    x : [xy[0]],
    y : [xy[1]],
    name: 'Траектория полёта'
  };

  Plotly.deleteTraces(Plot, [1]);
  Plotly.addTraces(Plot, trace);
  Plotly.moveTraces(Plot, -1, 1);
}

window.startDemo=function() {

    iterationCounter = 0;

    var originaldT = GetValue('dt');
    window.dt = originaldT * 0.001;

    var g = 9.8;
    var l = 8;
    length = l;
    snapped = false;

    blockAngles = [ cartesianToPolar(origin, {x:-5,y:5}), cartesianToPolar(origin, {x:1,y:8}) ];
    
    angle = GetValue('angle') * Math.PI/180;
    var angleV = 0;
    var accelationFunction = function(x, v, dt) {
      return (-g/l)*Math.sin(x);
    };

    RecreatePlot();

    var v0;
    var gravityFunction = function(x, v, dt) { return -g; };
    var zeroFunction = function(x, v, dt) { return 0; };

    stopped = false;
    animating = true;
    animate();

    window.interval = setInterval(function() 
    {
        if (!snapped)
        {
          var newAngle = rk4(angle, angleV, accelationFunction, window.dt);
          
          angle = newAngle[0];
          angleV = newAngle[1];
          da = angleV;
          
          for (var i = 0; i < 2; i++)
          {
            var dTheta = blockAngles[i] - angle;
            if (Math.abs(dTheta) < 0.02)
            {
              Log("snapped");
              snapped = true;
              var xy = polarToCartesian(origin, angle, length);
              
              var angle2 = getNormal(angle, da);
              var velocity = polarToCartesian(origin, angle2, length);

              velocity[1] = velocity[1] - 10;
              v0 = [velocity[0] * Math.abs(angleV), velocity[1] * Math.abs(angleV)];
              // v0 = [0,0];
              xBall = xy[0];
              yBall = xy[1];
              
            }
          }
        } 
        else
        {
          var newXBall = rk4(xBall, v0[0], zeroFunction, window.dt);
          var newYBall = rk4(yBall, v0[1], gravityFunction, window.dt);
          xBall = newXBall[0]; v0[0] = newXBall[1];
          yBall = newYBall[0]; v0[1] = newYBall[1];
        }
          
        iterationCounter++;

    }, window.dt*1000);
}


function animate() {
  if (stopped) return;
  requestAnimationFrame(animate);
  if (!animating) return;

  var xy, xy2;

  // var angle2 = getNormal(angle, da);
  // var xy1 = polarToCartesian(origin, angle2, length*Math.abs(da)/2);
  
  if (!snapped)
  {
    xy = polarToCartesian(origin, angle, length);
    xy2 = xy;
    
    var update = {
      x : [[xy[0]]],
      y : [[xy[1]]]
    }
  }
  else
  {
    xy = polarToCartesian(origin, angle, length);
    xy2 = [xBall, yBall];
    
    var update = {
      x : [[xy2[0]]],
      y : [[xy2[1]]]
    }
  }

  Plotly.extendTraces(Plot, update, [1]);

  // Log(xy[0].toFixed(2) + " " + xy[1].toFixed(2));
  Plotly.animate(Plot, {
    data: [{x: [0, xy[0]], y: [10, xy[1]]} ]
  }, {
    transition: {
      duration: 0
    },
    frame: {
      duration: 10,
      redraw: false
    }
    
  });


}

function getNormal(angle, da)
{
  var angle2 = (angle + Math.sign(da) * Math.PI/2);
  return angle2;
}

function polarToCartesian(origin, angle, length)
{
  var x = Math.sin(angle) * length;
  var y = Math.cos(angle) * length;
  return [origin.x + x, origin.y - y];
}

function cartesianToPolar(origin, xy)
{
  return Math.atan((origin.x - xy.x)/(origin.y - xy.y))
}