var iterationCounter = 0;
var animating = false;
var approximate;
var Ball = [0, 0];
var lastX = 0;
var stopped = false;

var lastVertex = [];
var approximationModels = {
  'none': { index: 0, name: "Траектория мяча" },
  'linear': { index: 1, name: "Траектория мяча (с линейной ап.)" },
  'quadratic': { index: 2, name: "Траектория мяча (с квадратичной ап.)" },
  'dt': { index: 3, name: "Траектория мяча (с переменным шагом)" }
}


window.toggleDemo = function () {
  if (stopped) {
    startDemo();
    document.getElementById('DemoButton').innerText = "Остановить моделирование";
  }
  else {
    stopDemo();
    document.getElementById('DemoButton').innerText = "Начать Моделирование";
  }
}

window.stopDemo = function () {
  stopped = true;
  clearInterval(window.interval);
}

window.onload = window.onresize = function () {
  cv = document.getElementById('myDiv');
  cv.width = document.body.clientWidth * 0.95; //document.width is obsolete
  cv.height = document.body.clientHeight * 0.7; //document.height is obsolete
  CreatePlot();
}

function getAnalyticalPoints(b, VB, xBall, yBall) {
  var precision = 0.1;
  var Range = [VB * Math.sqrt(2 * yBall / 9.8)];
  var x = [0, Range[0]];
  var y = [yBall, 0];

  var i = 0;
  var maxIterations = 10;

  Log("   Аналитические точки падения");
  while (yBall > precision) {
    i++;
    yBall = b * yBall;
    xBall = VB * Math.sqrt(2 * yBall / 9.8);
    
    Range.push(2 * xBall + Range[i - 1])
    x.push(Range[i]);
    y.push(0);
    Log("   X: " + x[i].toFixed(3) + " Y: " + y[i].toFixed(3));

    if (i > maxIterations) break;
  }

  var trace = {
    x: x,
    y: y,
    mode: 'markers',
    marker: {
      symbol: 'cross',
      size: 8
    },
    type: 'scatter',
    name: 'Аналитические точки удара'
  }
  var data = [trace];

  Plotly.deleteTraces("myDiv", [-1]);
  Plotly.addTraces("myDiv", data);
}

function CreatePlot() {
  var trace1 = {
    x: [Ball[0]],
    y: [Ball[1]],
    type: 'scatter',
    mode: 'lines+markers',
    name: 'Траектория мяча'
  };

  var trace2 = {
    x: [Ball[0]],
    y: [Ball[1]],
    type: 'scatter',
    mode: 'lines+markers',
    name: 'Траектория мяча (с линейной ап.)'
  };


  var trace3 = {
    x: [Ball[0]],
    y: [Ball[1]],
    type: 'scatter',
    mode: 'lines+markers',
    name: 'Траектория мяча (с квадратичной ап.)'
  };

  var trace4 = {
    x: [Ball[0]],
    y: [Ball[1]],
    type: 'scatter',
    mode: 'lines+markers',
    name: 'Траектория мяча (с переменным шагом)'
  };

  var points = {
    x: x,
    y: y,
    mode: 'markers',
    marker: {
      symbol: 'cross',
      size: 8
    },
    type: 'scatter',
    name: 'Аналитические точки удара'
  }


  var VB = parseFloat(GetValue('Vb'));
  var length = 8 * VB;
  var numSteps = 5;
  var gx = length / numSteps;
  var y = [];
  var x = [];
  for (var i = 0; i < numSteps; i++) {
    x.push(i * gx);
    y.push(0);
  }

  var layout = {
    yaxis: {
      range: [-1, 10]
    }
  };

  var data = [trace1, trace2, trace3, trace4, points];
  Plotly.newPlot('myDiv', data, layout);
}

function RecreatePlot() {
  var trace = {
    x: [Ball[0]],
    y: [Ball[1]],
    type: 'scatter',
    mode: 'lines+markers',
    name: approximationModels[approximate].name
  };

  Plotly.deleteTraces("myDiv", [approximationModels[approximate].index]);
  Plotly.addTraces("myDiv", trace);
  Plotly.moveTraces("myDiv", -1, approximationModels[approximate].index);
}

window.startDemo = function () {

  stopped = false;
  
  approximate = document.querySelector('input[name="approx"]:checked').value;
  
  iterationCounter = 0;
  
  var beenOver = true;
  var bounceIndex = 0;
  var x0 = 0;
  var y0 = 0;
  
  var xBall = 0;
  
  var yBall = parseFloat(parseFloat(GetValue('H')));
  var b = parseFloat(GetValue('beta'));
  var VB = parseFloat(GetValue('Vb'));
  
  var originaldT = GetValue('dt');
  window.dt = originaldT * 0.001;
  
  Log("");
  Log("");
  Log("- Начало эксперимента -");
  Log("   Начальная высота: " + yBall);
  Log("   β: " + b);
  Log("   Скорость мяча: " + VB);
  Log("   Шаг итерации: " + dt);
  Log("   Аппроксимация: " + approximate)
  
  var H = yBall;
  var theta = Math.sqrt(b);
  var v0 = [VB, 0];
  Ball = [xBall, yBall];
  lastVertex = [xBall, yBall];
  
  RecreatePlot();
  getAnalyticalPoints(b, VB, xBall, yBall);
  Log("");
  b = theta;

  animating = true;
  animate();

  window.interval = setInterval(function () {

    var newXBall = rk4(xBall, v0[0], (function (x, v, dt) {
      return 0;
    }), window.dt);

    var newYBall = rk4(yBall, v0[1], (function (x, v, dt) {
      return -9.8;
    }), window.dt);

    // LINEARLY APPROXIMATE HIT POSITION
    if (approximate == "linear") {
      var gy = 0;
      if (newYBall[0] < gy) {
        var newX = newXBall[0];
        var oldX = xBall;
        var newY = newYBall[0];
        var oldY = yBall;

        var dy = (gy - newY);
        var tan = (newX - oldX) / (newY - oldY);
        var dx = tan * dy;

        // HIT POSITION: [x-dx, 0]
        newXBall[0] = newXBall[0] + dx;
        newYBall[0] = gy;

        Log(" ÷ Событие:");
        Log("   X: " + newXBall[0].toFixed(3) + "  Y: " + newYBall[0].toFixed(3));

        // APPROXIMATE BOUNCE ANGLE
        newYBall[1] = Math.sqrt(2 * 9.8 * H) * theta;
        theta = theta * b;
        beenOver = false;
      }
    }

    if (approximate == "quadratic") {
      var gy = 0;
      if (newYBall[0] < gy) {
        var newX = newXBall[0];
        var oldX = xBall;
        var newY = newYBall[0];
        var oldY = yBall;

        newXBall[0] = GetQuadraticZero(lastVertex[0],
          lastVertex[1], oldX, oldY, newX, newY);
        newYBall[0] = gy;
        lastVertex = [newXBall[0], newYBall[0]];

        Log(" ÷ Событие:");
        Log("   X: " + newXBall[0].toFixed(3) + "  Y: " + newYBall[0].toFixed(3));

        // APPROXIMATE BOUNCE ANGLE
        newYBall[1] = Math.sqrt(2 * 9.8 * H) * theta;
        theta = theta * b;
        beenOver = false;
      }
    }


    xBall = newXBall[0];
    yBall = newYBall[0];
    v0[0] = newXBall[1];
    v0[1] = newYBall[1];

    // WITHOUT APPROXIMATION4
    if (approximate == "none") {
      if (yBall < 0 && beenOver) {
        beenOver = false;
        Log(" ÷ Событие:");
        Log("   X: " + newXBall[0].toFixed(3) + "  Y: " + newYBall[0].toFixed(3));
        v0[1] = -v0[1] * theta;
      }
      else if (yBall > 0) {
        beenOver = true;
      }
    }

    if (approximate == "dt") {
      dt = ((Math.min((Math.abs(yBall) + 0.2) / H, 1)) * (originaldT)) * 0.001;
      console.log(dt);
      if (yBall < 0 && beenOver) {
        beenOver = false;
        Log(" ÷ Событие:");
        Log("   X: " + newXBall[0].toFixed(3) + "  Y: " + newYBall[0].toFixed(3));
        v0[1] = -v0[1] * theta;
      }
      else if (yBall > 0) {
        beenOver = true;
      }
    }

    Ball = [xBall, yBall];

    if (Math.round(v0[1]) == 0 && yBall <= 0 && !beenOver) {
      clearInterval(window.interval);
      Log("Моделирование завершено");
      animating = false;
      stopped = true;
    }

    iterationCounter++;

  }, originaldT);
}


function animate() {
  if (stopped) return;
  requestAnimationFrame(animate);

  if (!animating) return;
  if (lastX == Ball[0]) return;

  var update = {
    x: [[Ball[0]]],
    y: [[Ball[1]]]
  }

  Plotly.extendTraces("myDiv", update, [approximationModels[approximate].index]);

}