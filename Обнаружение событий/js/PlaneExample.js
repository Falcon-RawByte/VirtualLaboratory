var iterationCounter = 0;
var animating = false;
var approximate;
var Ball = [0,0];
var lastX = 0;
var stopped = false;

window.stopDemo=function()
{
  stopped = true;
  clearInterval(window.interval);
}

window.onload = window.onresize = function() {
    cv = document.getElementById('myDiv');
    cv.width = document.body.clientWidth*0.95; //document.width is obsolete
    cv.height = document.body.clientHeight * 0.7; //document.height is obsolete
}

function getAnalyticalPoints(b, VB, xBall, yBall)
{
    var precision = 0.1;
    var Range = [VB * Math.sqrt(2*yBall/9.8)];
    var x = [0, Range[0]];
    var y = [yBall, 0];

    var i = 0;

    while (yBall > precision)
    {
      i++;
      yBall = b * yBall;
      xBall = VB * Math.sqrt(2*yBall/9.8);

      Range.push(2*xBall + Range[i - 1])
      x.push(Range[i - 1] + xBall);
      y.push(yBall);
      x.push(Range[i]);
      y.push(0);
    }

    var trace = {
      x : x,
      y : y,
      mode: 'markers',
      type: 'scatter',
      name: 'Аналитические экстремумы'
    }
    var data = [trace];
    Plotly.addTraces('myDiv', data);
}

function CreatePlot()
{
    var trace1 = {
      x: [Ball[0]],
      y: [Ball[1]],
      type: 'scatter',
      name: 'Траектория мяча'
    };

    var trace2 = {
      x: [Ball[0]],
      y: [Ball[1]],
      type: 'scatter',
      name: 'Траектория мяча (с аппроксимацией)'
    };


    var VB = parseFloat(GetValue('Vb'));
    var length = 8 * VB;
    var numSteps = 5;
    var gx = length/numSteps;
    var y = [];
    var x = [];
    for (var i = 0; i < numSteps; i++)
    {
    	x.push(i * gx);	
    	y.push(groundZero(i*gx, 0, 0));
    }

    var ground = {
    	y: y,
    	x: x,
    	type: 'scatter',
    	line: {shape: 'hv'},
    	name: 'Функция поверхности'
    };

    var data = [trace1, trace2, ground];
    Plotly.newPlot('myDiv', data);
}

function GetValue(value)
{
  return document.getElementById(value).value;
}

function Log(string)
{
	document.getElementById("logText").value += '\n' + string;
}

window.startDemo=function() {

	Log("Начало эксперимента");
    stopped = false;
    approximate = document.getElementById("approx").checked;
    iterationCounter = 0;

    var beenOver = true;
    var bounceIndex = 0;
    var x0 = 0;
    var y0 = 0;

    var xBall = 0;

    var yBall =  parseFloat(parseFloat(GetValue('H')));
    var b  = parseFloat(GetValue('beta'));
    var VB = parseFloat(GetValue('Vb'));
    window.dt = GetValue('dt') * 0.001;
    
	Log("Начальная высота: " + yBall);
	Log("β: " + b);
	Log("Скорость мяча: " + VB);
	Log("Шаг итерации: " + dt);
	Log("Аппроксимация: " + approximate)
    
    var H = yBall;
    var theta = Math.sqrt(b);
    var v0 = [VB, 0];
    Ball = [xBall, yBall];

    CreatePlot();
    getAnalyticalPoints(b, VB, xBall, yBall);
    b = theta;

    animating = true;
    animate();

    window.interval = setInterval(function() {
      
        var newXBall = rk4(xBall, v0[0], (function(x, v, dt) {
          return 0;
        }), window.dt);

        var newYBall = rk4(yBall, v0[1], (function(x, v, dt) {
          return -9.8;
        }), window.dt);

        // LINEARLY APPROXIMATE HIT POSITION
        if (approximate)
        {
        	var gy = groundZero(newXBall[0], 0, 0);
          if (newYBall[0] < gy)
            {
            	Log("	::Столкновение::");
            	Log("X: " + oldX + "Y: " + oldY);
                var newX = newXBall[0];
                var oldX = xBall;
                var newY = newYBall[0];
                var oldY = yBall;
  
                var dy = (gy - newY);
                var tan = (newX - oldX)/(newY - oldY);
                var dx = tan * dy;
  
                // HIT POSITION: [x-dx, 0]
                newXBall[0] = newXBall[0] + dx;
                newYBall[0] = gy;
  
                // APPROXIMATE BOUNCE ANGLE
                newYBall[1] = Math.sqrt(2*9.8*H - VB*VB) * theta;
                theta = theta * b;
                Log("	Новая скорость по y: " + newYBall[1]);
  
              beenOver = false;
            }
        }

        xBall = newXBall[0];
        yBall = newYBall[0];
        v0[0] = newXBall[1];
        v0[1] = newYBall[1];

        // WITHOUT APPROXIMATION4
        if (!approximate)
        {
          if (yBall < groundZero(newXBall[0], 0, 0) && beenOver)
          {
            beenOver = false;
            v0[1] = -v0[1]*theta;
          }
          else if (yBall > 0)
          {
            beenOver = true;
          }
        }

        Ball = [xBall, yBall];

        if (Math.round(v0[1]) == 0 && yBall <= 0 && !beenOver)
        {
          clearInterval(window.interval);
          Log("Моделирование завершено");
          animating = false;
          stopped = true;
        } 

        iterationCounter++;

    }, window.dt*1000);
}


function animate() {
  if (stopped) return;
  requestAnimationFrame(animate);
  
  if (!animating) return;
  if (lastX == Ball[0]) return;

  var update = {
    x : [[Ball[0]]],
    y : [[Ball[1]]]
  }

  if (approximate)
    Plotly.extendTraces("myDiv", update, [1]);
  else
    Plotly.extendTraces("myDiv", update, [0]);
}


// -- GROUND FUNCTIONS
function groundZero(x, length, param) 
{
	// y = 0
	return param;
}

function groundSteps(x, length, height, dy)
{
	return height - Math.floor(x / length)*dy;
}