var cv;
var ctx;
var cvWidth;
var cvHeight;

var everyObject = [];
var planeObject = [0,0];

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
    
    var vPlane =  parseFloat(document.getElementById('Va').value);
    var hPlane =  parseFloat(document.getElementById('H').value);
    var sPlane =  parseFloat(document.getElementById('S').value);
    var xPlane = 0;
    planeObject = [xPlane, hPlane];

    cv = document.getElementById('myCanvas');
    ctx = cv.getContext('2d');
    cvWidth = cv.width;
    cvHeight = cv.height;

    animate();

    window.interval = setInterval(function() {
      
      // console.log(xPlane + "  --  " + vPlane);
      var statePlane = rk4(xPlane, vPlane, (function(x, v, dt) {
        return 0;
      }), window.dt);

      xPlane = statePlane[0];
      planeObject = [xPlane, hPlane];

      if (xPlane > sPlane)
      {
        var stateX = rk4(x0, v0[0], (function(x, v, dt) {
          return 0;
        }), window.dt);

        var stateY = rk4(y0, v0[1], (function(x, v, dt) {
          return -9.8;
        }), window.dt);

        x0 = stateX[0];
        y0 = stateY[0];
        v0 = [stateX[1], stateY[1]];

        everyObject.push([x0, y0, 5, 5, 'black']);
      }

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
  ctx.moveTo(0,cvHeight-0);
  ctx.lineTo(cvWidth,cvHeight-0);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(planeObject[0],cvHeight-planeObject[1],5,0,2*Math.PI);
  ctx.fill();

  var step;
  for (step = 0; step < everyObject.length - 1; step++) {
    var o = everyObject[step];
    ctx.beginPath();
    ctx.arc(o[0], cvHeight-o[1],1,0,2*Math.PI);
    ctx.fill();
  }

  if (everyObject.length > 1)
  {
    var o = everyObject[everyObject.length - 1];
    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.arc(o[0], cvHeight-o[1],3,0,2*Math.PI);
    ctx.fill();
  }

}
