$(function(){
	// var canvas = document.getElementById('myCanvas');
	// var ctx = canvas.getContext('2d');
	// Axsis(ctx, canvas);
	InitPlotly();
	$("#button").click(function(){
		animate(
			[parseFloat($("#x").val()),parseFloat($("#x").val())],//one for rk and one for euler. this is ridiculous
			[parseFloat($("#v").val()),parseFloat($("#v").val())],
			[parseFloat($("#f").val()), parseFloat($("#h").val()), parseFloat($("#k").val()), parseFloat($("#m").val())],//consts
			parseFloat($("#step").val()),
			parseFloat($("#accuracy").val())
			);
		//(x, v, m, h, k, f, n)
		//(coord of displacement, starting velocity, mass, 
		//enviroment resistance const, coefficient of elasticity, 
		//force, number of iterations)
	})

	$("#buttonErase").click(function(){
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		Axsis(ctx, canvas);
	})
});

function InitPlotly(graph, x, y) {
	Plotly.newPlot('tester',
		[
			{x:[[x]],y:[[y]],type:'scatter',maxdisplayed:100, marker: {color: 'pink', size: 8}},
			{x:[[x]],y:[[y]],type:'scatter',maxdisplayed:100, marker: {color: 'gray', size: 8}}
		],
		{title:'Weight coordinate', xaxis:{title:'Time, sec'},
		yaxis:{title:'Distance from equilibrium, m'}
	});
}

function DrawPlotly(xCoord, yCoord, graph){
	Plotly.extendTraces('tester', {
		x: [[xCoord]],
		y: [[yCoord]]
	}, [parseInt(graph)])
}

function Axsis(ctx, canvas){
	ctx.beginPath();
	ctx.moveTo(0,canvas.height/2);
	ctx.lineTo(canvas.width, canvas.height/2);
	ctx.strokeStyle = "black";
	ctx.stroke();
}

function Frml(eqConst, variable1, variable2){
	//ODE type: m*x" + H*x' + k*x = f(t)
	return (eqConst[0] - eqConst[1]*variable1 - eqConst[2]*variable2)/eqConst[3];
	// return (f - h*variable1 - k*variable2)/m;
}

function SolveEuler(x, y, equation, equationConsts, step) { //OLD MAGIC
	//console.log("euler x = " + x + ", v = " + y);
	var x0 = x, y0 = y;

	x += step*equation(equationConsts, x, y);
	y += step;
 	// var continueFlag = (Math.abs(y-y0) < accuracy) ? true : false;
	return [x, y];
}

ExplicitEulerSystem=(function()//y(i,n+1)=y(i,n)+dt*f(t,y(n))
{
	function Step(xv,t,delta,funcs)
	{
		var count = xv.length;
		var k = new Array(count);
		for(var i = 0; i < count; i++)
		{
			k[i]=delta*funcs[i](xv,t);
		}
		for(var i = 0; i < count; i++)
			xv[i]+=k[i];
	}
})();

// function SolveEulerNew(x, v, equation, equationConsts, step){
// 	var x0 = x, v0 = v;

// 	x += 

// }

// function getFunctions(parameters)//TODO get function
// {
// 	var u=parameters[0];
// 	var functions=new Array(2);
// 	functions[0]=function(x,t)
// 	{
// 		return x[1];
// 	};
// 	functions[1]=function(x,t)
// 	{
// 		var x0=x[0];
// 		var v0=x[1];
// 		return u*(1-x0*x0)*v0-x0;
// 	};
// 	return functions;
// }

function SolveRK4(x, v, equation, equationConsts, step){
	
	console.log("rk4 x = " + x + ", v = " + v);

	var x0 = x, v0 = v; 

	var k0 = v0;
	var l0 = equation(equationConsts, v0, x0);

	var k1 = v0 + l0/2;
	var l1 = equation(equationConsts, v0+l0/2, x0+k0/2);

	var k2 = v0 + l1/2;
	var l2 = equation(equationConsts, v0+l1/2, x0+k1/2);

	var k3 = v0 + l2;
	var l3 = equation(equationConsts, v0+l2, x0+k2);

	x = x0 + step/6*(k0+2*k1+2*k2+k3);
	v = v0 + step/6*(l0+2*l1+2*l2+l3);

	return [x, v];
}

function TranslateCoord(x, y, canvas, radius){//norm and translate coords to canvas coords
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
	ctx.fillStyle = $("#colors").val();//TODO: can be broken by switching color in a process of solving, cannot think better way of getting color
	ctx.fill();
	ctx.lineWidth = 0;
	ctx.strokeStyle = $("#colors").val();
	ctx.stroke();
}

function animate(x, v, equationConsts, step, accuracy) {
  var start = performance.now();
  var i = 0;

  requestAnimationFrame(function animate(time) {
  	var flagRK = true, flagEuler = true; //because of methods RK4 and Eulre constraction flags are needed for stopping cycle 

    //DrawCircle(i, x, 1);
    // DrawPlotly(i*step, x[0], 0);
    // DrawPlotly(i*step, x[1], 1);

	Plotly.extendTraces('tester', {x: [[i*step]], y:[[x[0]]] }, [0]);//RK drawing
    //Plotly.extendTraces('tester', {x: [[i*step]], y:[[x[1]]] }, [1]);//EUler drawing

    // var rungeAnswers = SolveRK4(x, v, m, h, k, f, n);
    var answersRK4 = SolveRK4(x[0], v[0], Frml, equationConsts, step);
    var answersEuler = SolveEuler(x[1], v[1], Frml, equationConsts, step);//INPORTANT

    if (Math.abs(x[0]-answersRK4[0]) > accuracy) {// check accuracy 
	    x[0] = answersRK4[0];
	    v[0] = answersRK4[1];
	}
	else{
		flagRK = false;
	}

	if (Math.abs(x[1]-answersEuler[0]) > accuracy) {
	    x[1] = answersEuler[0];
	    v[1] = answersEuler[1];
    }
    else{
    	flagEuler = false;
    }

    if(flagRK ){//|| flagEuler
	    i++;
	    requestAnimationFrame(animate);
	}
  });
}