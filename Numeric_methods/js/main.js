$(function(){
	var canvas = document.getElementById('myCanvas');
	var ctx = canvas.getContext('2d');
	Axsis(ctx, canvas);
	$("#button").click(function(){
		//TODO: add f(t)
		// animate(120, 1, 1, 0.2, 0.6, 2, 250);
		animate(parseFloat($("#x").val()),
			parseFloat($("#v").val()),
			parseFloat($("#m").val()),
			parseFloat($("#h").val()),
			parseFloat($("#k").val()),
			parseFloat($("#f").val()),
			parseFloat($("#n").val()));
		//(x, v, m, h, k, f, n)
		//(coord of displacement, starting velocity, mass, 
		//enviroment resistance const, coefficient of elasticity, 
		//force, number of iterations)

		// SolveRunge(0, 10, 0.1, 100);
	})

	$("#buttonErase").click(function(){
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		Axsis(ctx, canvas);
	})
});

function Axsis(ctx, canvas){
	ctx.beginPath();
	ctx.moveTo(0,canvas.height/2);
	ctx.lineTo(canvas.width, canvas.height/2);
	ctx.strokeStyle = "black";
	ctx.stroke();
}

function f(x, y)
{
    return -y - Math.pow(x, 2);
}

function Frml(f, h, k, m, variable1, variable2){
	return (f - h*variable1 - k*variable2)/m;
}

function Intrvl(a, b, n){
	return -(a-b)/n;//STUPID FIX
}

function SolveRunge(x, y, h, n){

	//ODE type: m*x" + H*x' + k*x = f(t)
	var yStart, k1, k2, k3;
	console.log("x = " + x + ", y = " + y);

	yStart = y;
	k1 = h * f(x, y);
	x = x + h / 2;
	y += k1 / 2;
	k2 = f(x, y) * h;
	y = yStart + k2 / 2;
	k3 = f(x, y) * h;
	x = x + h / 2;
	y = yStart + k3;
	y = yStart + (k1 + 2 * k2 + 2 * k3 + f(x, y) * h) / 6;
	//yStart = y;
	n--;

	var rungeAnswers = [x, y, h, n];
	return rungeAnswers;
}

function TrySolveRunge(x, v, m, h, k, f, n){
	//ODE type: m*x" + H*x' + k*x = f(t)

	var a = 0, b = 20;//borders

	console.log("x = " + x + ", v = " + v);

	var x0 = x, v0 = v; 

	var k0 = v0;
	var l0 = Frml(f, h, k, m, v0, x0);

	var k1 = v0 + l0/2;
	var l1 = Frml(f, h, k, m, v0+l0*Intrvl(a,b,n)/2, x0+k0*Intrvl(a,b,n)/2);

	var k2 = v0 + l1/2;
	var l2 = Frml(f, h, k, m, v0+l1*Intrvl(a,b,n)/2, x0+k1*Intrvl(a,b,n)/2);

	var k3 = v0 + l2;
	var l3 = Frml(f, h, k, m, v0+l2*Intrvl(a,b,n), x0+k2*Intrvl(a,b,n));

	x = x0 + Intrvl(a,b,n)/6*(k0+2*k1+2*k2+k3);
	v = v0 + Intrvl(a,b,n)/6*(l0+2*l1+2*l2+l3);

	var rungeAnswers = [x, v, m, h, k, f, n];
	return rungeAnswers;
}

function TranslateCoord(x, y, canvas, radius){//norm and translate coords to canvas coords
	// var coordX = x + canvas.width/2;
	// var coordY = y + canvas.height/2;

	var coordX = x;
	var coordY = y + canvas.height/2 -radius;	
	return coords = [coordX, coordY];
	
}

function DrawCircle(coordX, coordY, radius) {
	var canvas = document.getElementById('myCanvas');
	var ctx = canvas.getContext('2d');

	coords = TranslateCoord(coordX, coordY, canvas, radius);

	ctx.beginPath();
	ctx.arc(coords[0], coords[1], radius, 0, 2 * Math.PI, false);
	ctx.fillStyle = $("#colors").val();//TODO: BAD BAD BAD BAD
	ctx.fill();
	ctx.lineWidth = 0;
	ctx.strokeStyle = $("#colors").val();
	ctx.stroke();
}

function animate(x, v, m, h, k, f, n) {
  var start = performance.now();
  var i = 0;
  requestAnimationFrame(function animate(time) {

    DrawCircle(i, x, 1);
    // var rungeAnswers = SolveRunge(x, y, h, n);
    // x = rungeAnswers[0];
    // y = rungeAnswers[1];
    // h = rungeAnswers[2];
    // n = rungeAnswers[3];

    i++;
    var rungeAnswers = TrySolveRunge(x, v, m, h, k, f, n);
    x = rungeAnswers[0];
    v = rungeAnswers[1];
    m = rungeAnswers[2];
    h = rungeAnswers[3];
    k = rungeAnswers[4];
    f = rungeAnswers[5];
    n = rungeAnswers[6];
    
    if (n > i) {// if number of iterations is not 0
      requestAnimationFrame(animate);
    }

  });
}