var cv;
var ctx;
var cvWidth;
var cvHeight;

var Ball = [0,0];

window.stopDemo=function()
{
  clearInterval(window.interval);
  everyObject = [];
}

window.startDemo=function() {

    var x0 = 0
    var y0 = 0

    window.dt = document.getElementById('dt').value * 0.001;
    var a  = parseFloat(document.getElementById('A').value);
    var VB = parseFloat(document.getElementById('Vb').value);
    var v0 = [VB*Math.cos(a*0.0174533), VB*Math.sin(a*0.0174533)];
    var yBall =  parseFloat(document.getElementById('H').value);
    var xBall = 0;

    Ball = [xBall, yBall];

    cv = document.getElementById('myCanvas');
    ctx = cv.getContext('2d');
    cvWidth = cv.width;
    cvHeight = cv.height;

    animate();
    var beenOver = true;

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
          v0[1] = -v0[1]*0.6;
          console.log(v0[1])
        }
        else if (yBall > 0)
        {
          beenOver = true;
        }


        Ball = [xBall, yBall];

        if (Math.round(y0) < 0)
        {
          clearInterval(window.interval);
          alert("Donezo");
        } 

    }, window.dt*1000);
}


function animate() {
  requestAnimationFrame(animate);
  ctx.clearRect(0, 0, cvWidth, cvHeight);

  ctx.fillStyle = 'black';
  ctx.moveTo(0,cvHeight-20);
  ctx.lineTo(cvWidth,cvHeight-20);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(Ball[0],cvHeight-20-Ball[1],5,0,2*Math.PI);
  ctx.fill();

}
