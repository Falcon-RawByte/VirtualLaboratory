var cv;
var ctx;
var cvWidth;
var cvHeight;
var iterationCounter = 0;

var Ball = [0,0];
var trajectoryPoints = [];

window.stopDemo=function()
{
  clearInterval(window.interval);
  everyObject = [];
}

window.onload = window.onresize = function() {
    cv = document.getElementById('myCanvas');
    cv.width = document.body.clientWidth*0.95; //document.width is obsolete
    cv.height = document.body.clientHeight * 0.7; //document.height is obsolete
    ctx = cv.getContext('2d');
    cvWidth = cv.width;
    cvHeight = cv.height;

    trajectoryPoints = [];
    var yBall =  parseFloat(document.getElementById('H').value);
    Ball = [0, yBall];
    animate();

    $('#H').on('input',function(e){
        Ball = [0, $( this ).val()];
        animate();
    });

}

window.startDemo=function() {

    var x0 = 0
    var y0 = 0

    window.dt = document.getElementById('dt').value * 0.001;
    var a  = parseFloat(document.getElementById('A').value);
    var b  = parseFloat(document.getElementById('beta').value);
    var VB = parseFloat(document.getElementById('Vb').value);
    var v0 = [VB*Math.cos(a*0.0174533), VB*Math.sin(a*0.0174533)];
    var yBall =  parseFloat(document.getElementById('H').value);
    var xBall = 0;

    Ball = [xBall, yBall];

    animate();
    var beenOver = true;
    trajectoryPoints = [];
    iterationCounter = 0;

    window.interval = setInterval(function() {
      
        var newXBall = rk4(xBall, v0[0], (function(x, v, dt) {
          return 0;
        }), window.dt);

        var newYBall = rk4(yBall, v0[1], (function(x, v, dt) {
          return -9.8;
        }), window.dt);

        xBall = newXBall[0];
        v0[0] = newXBall[1];
        yBall = newYBall[0];
        v0[1] = newYBall[1];

        if (yBall < 0 && beenOver)
        {
          beenOver = false;
          v0[1] = -v0[1]*b;
          console.log(v0[1])
        }
        else if (yBall > 0)
        {
          beenOver = true;
        }

        Ball = [xBall, yBall];
        // alert(50.0/(window.dt*1000));
        if (iterationCounter % (8 * 50.0/(window.dt*1000)) == 0)
          trajectoryPoints.push(Ball);

        if (Math.round(v0[1]) == 0 && !beenOver)
        {
          clearInterval(window.interval);
          alert("Donezo");
        } 

        iterationCounter++;

    }, window.dt*1000);
}


function animate() {
  requestAnimationFrame(animate);
  ctx.clearRect(0, 0, cvWidth, cvHeight);

  ctx.fillStyle = 'black';
  ctx.moveTo(0,cvHeight-20);
  ctx.lineTo(cvWidth,cvHeight-20);
  ctx.stroke();

  ctx.moveTo(20,cvHeight);
  ctx.lineTo(20,0);
  ctx.stroke();

  ctx.moveTo(Ball[0] + 20, cvHeight - 20 -Ball[1]);
  for (var i = trajectoryPoints.length - 1; i >= 0; i--) {
    ctx.lineTo(
    20 + trajectoryPoints[i][0],
    cvHeight - 20 - trajectoryPoints[i][1]);
    ctx.stroke();
  }

  ctx.fillStyle = 'orange';
  ctx.beginPath();
  ctx.arc(Ball[0]+20,cvHeight-20-Ball[1],5,0,2*Math.PI);
  ctx.fill();

}
