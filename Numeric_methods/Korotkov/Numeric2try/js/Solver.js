$(function(){

	$("#buttonSolve").click(function(){
		Solve();
		//(x, v, m, h, k, f, n)
		//(coord of displacement, starting velocity, mass, 
		//enviroment resistance const, coefficient of elasticity, 
		//force, number of iterationEulers)
	})

	$("#buttonErase").click(function(){
		if(parseFloat($("#x").val()) != null){
			InitPlotly($("#x").val(), [0,1]);		
		}
		else{
			alert("Please enter x");
		}
	})
});

function Solve(){
	var eulerSolver = new EulerSolver();//
	eulerSolver.Step($("#step").val());//setters
	eulerSolver.X($("#x").val());
	eulerSolver.Time($("#time").val());
	eulerSolver.Mass($("#mass").val());
	eulerSolver.K($("#k").val());

	var rk4Solver = new RK4Solver();
	rk4Solver.Step($("#step").val());
	rk4Solver.X($("#x").val());
	rk4Solver.Time($("#time").val());
	rk4Solver.Mass($("#mass").val());
	rk4Solver.K($("#k").val());
	rk4Solver.F();


	InitPlotly(eulerSolver.X(), [0,1]);
	while (eulerSolver.currentTime() <= eulerSolver.Time() && rk4Solver.currentTime() <= rk4Solver.Time() ){
		eulerSolver.IterationEuler();
		rk4Solver.IterationRK4();
	}
}

function EulerSolver()
{
	var step = 0.1;
	var x = 20;
	var time = 0;
	var mass = 1;
	var k = 0.8;

	var currentTime = 0;
	var v = 0;
	var a = 0;

	this.Step = function(timeStep){//setters
		if (parseFloat(timeStep) <= 0){
			throw new Error("Step must be > 0");
		}
		step = parseFloat(timeStep);
	}

	this.X = function(setX){
		if (!arguments.length) return x; //get
		x = parseFloat(setX); //else set
	}

	this.Time = function(setTime){
		if(!arguments.length) return time;
		if(parseFloat(setTime) < 0){
			throw new Error("time < 0");
		}
		time = parseFloat(setTime);
	}

	this.Mass = function(setMass){
		if(!arguments.length) return mass;
		if(parseFloat(setMass) < 0){
			throw new Error("mass < 0");
		}
		mass = parseFloat(setMass);
	}

	this.K = function(setK){
		if(!arguments.length) return k;
		k = parseFloat(setK);
	}

	this.currentTime = function(){
		return currentTime;
	}

	this.IterationEuler = function(){
		currentTime += step;
		a = -(k*x)/mass;
		v += a; 
		x += step * v;
		Draw(currentTime, x, 0);
		console.log("EUL: currT = " + Math.round( currentTime * 10) / 10 + ", a = " +Math.round( a * 10) / 10 + " v = " + Math.round( v * 10) / 10 + ",x = " + Math.round( x* 10) / 10);
	}

	function Draw(xCoord, yCoord, graphIndex){
		// Plotly.extendTraces('plot',	x: [[xCoord]], y:[[yCoord]], [0])
		// Plotly.extendTraces('plot', {y:[[yCoord]]}, [0]);
		Plotly.extendTraces('plot', {x: [[xCoord]], y:[[yCoord]] }, [graphIndex]);
	}
}

// function RK4Solver() //old
// {
// 	var step = 0.1;
// 	var x = 20;
// 	var time = 0;
// 	var mass = 1;
// 	var k = 0.8;

// 	var currentTime = 0;
// 	var v = 0;
// 	var a = 0;

// 	this.Step = function(timeStep){//setters
// 		if (parseFloat(timeStep) <= 0){
// 			throw new Error("Step must be > 0");
// 		}
// 		step = parseFloat(timeStep);
// 	}

// 	this.X = function(setX){
// 		if (!arguments.length) return x; //get
// 		x = parseFloat(setX); //else set
// 	}

// 	this.Time = function(setTime){
// 		if(!arguments.length) return time;
// 		if(parseFloat(setTime) < 0){
// 			throw new Error("time < 0");
// 		}
// 		time = parseFloat(setTime);
// 	}

// 	this.Mass = function(setMass){
// 		if(!arguments.length) return mass;
// 		if(parseFloat(setMass) < 0){
// 			throw new Error("mass < 0");
// 		}
// 		mass = parseFloat(setMass);
// 	}

// 	this.K = function(setK){
// 		if(!arguments.length) return k;
// 		k = parseFloat(setK);
// 	}

// 	this.currentTime = function(){
// 		return currentTime;
// 	}

// 	this.IterationRK4 = function(){
// 		currentTime += step;
// 		var x0 = x, v0 = v; 

// 		var k0 = v0;
// 		var l0 = -k*x/mass;

// 		var k1 = v0 + l0/2;
// 		var l1 = -k*x/mass + k0/2;

// 		var k2 = v0 + l1/2;
// 		var l2 = -k*x/mass + k1/2;

// 		var k3 = v0 + l2;
// 		var l3 = -k*x/mass + k2;

// 		x = x0 + step/6*(k0+2*k1+2*k2+k3);
// 		v = v0 + step/6*(l0+2*l1+2*l2+l3);

// 		Draw(currentTime, x, 1);
// 		console.log("RK4: currT = " + time + ", a = " + a + " v = " + v + ",x = " + x);
// 	}

// 	function Draw(xCoord, yCoord, graphIndex){
// 		// Plotly.extendTraces('plot',	x: [[xCoord]], y:[[yCoord]], [0])
// 		// Plotly.extendTraces('plot', {y:[[yCoord]]}, [0]);
// 		Plotly.extendTraces('plot', {x: [[xCoord]], y:[[yCoord]] }, [graphIndex]);
// 	}
// }

function RK4Solver()
{
	var x = 20;//
	var v = 0;//

	var step = 0.1;//dt
	
	var time = 0;
	var mass = 1;
	var k = 0.8;

	var currentTime = 0;
	// var v = 0;//dx/dt = v
	var a = 0;//dv/dt = a

	var f;

	this.Step = function(timeStep){//setters
		if (parseFloat(timeStep) <= 0){
			throw new Error("Step must be > 0");
		}
		step = parseFloat(timeStep);
	}

	this.X = function(setX){
		if (!arguments.length) return x; //get
		x = parseFloat(setX); //else set
	}

	this.Time = function(setTime){
		if(!arguments.length) return time;
		if(parseFloat(setTime) < 0){
			throw new Error("time < 0");
		}
		time = parseFloat(setTime);
	}

	this.Mass = function(setMass){
		if(!arguments.length) return mass;
		if(parseFloat(setMass) < 0){
			throw new Error("mass < 0");
		}
		mass = parseFloat(setMass);
	}

	this.K = function(setK){
		if(!arguments.length) return k;
		k = parseFloat(setK);
	}

	this.currentTime = function(){
		return currentTime;
	}

	this.F = function(setF){
		F = setF;
	}

	this.IterationRK4 = function () {
		currentTime += step;
		//var x0 = x, v0 = v, a0 = a;

		var x0 = x;
		var v0 = v;
		var a0 = -k*x/mass;
		// var a0 = 1;

		var x1 = x + v0/2*step;
		var v1 = v + a0/2*step;
		var a1 = -k*x/mass;
		// var a1 = 1;

		var x2 = x + v1/2*step;
		var v2 = v + a1/2*step;
		var a2 = -k*x/mass;
		// var a2 = 1;

		var x3 = x + v2*step;
		var v3 = v + a2*step;
		var a3 = -k*x/mass;
		// var a3 = 1;

		x += step/6*(v0+2*v1+2*v2+v3);
		v += step/6*(a0+2*a1+2*a2+a3);

		Draw(currentTime, x, 1);
		// Math.round( num * 10) / 10
		console.log("RK4: currT = " + Math.round( currentTime * 10) / 10 + ", a = " +Math.round( a * 10) / 10 + " v = " + Math.round( v * 10) / 10 + ",x = " + Math.round( x* 10) / 10);
	}

	function Draw(xCoord, yCoord, graphIndex){
		// Plotly.extendTraces('plot',	x: [[xCoord]], y:[[yCoord]], [0])
		// Plotly.extendTraces('plot', {y:[[yCoord]]}, [0]);
		Plotly.extendTraces('plot', {x: [[xCoord]], y:[[yCoord]] }, [graphIndex]);
	}
}

function InitPlotly(x, y) {
	Plotly.newPlot('plot',
		[
			{x:[[x]],y:[[y]],name: 'euler',type:'scatter',maxdisplayed:100, marker: {color: 'pink', size: 8}},
			{x:[[x]],y:[[y]],name: 'rk4',type:'scatter',maxdisplayed:100, marker: {color: 'gray', size: 8}}
		],
		{title:'Weight coordinate', xaxis:{title:'Time, sec'},
		yaxis:{title:'Distance from equilibrium, m'}
	});
}