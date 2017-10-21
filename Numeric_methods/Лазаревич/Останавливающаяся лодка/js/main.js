


function RK4SolverStep(xv,t,delta,funcs)
{
	var count=xv.length;
	var k=new Array(4*count);
	var ktemp=new Array(count);
	for(var i=0;i<count;i++)
	{
		k[i]=delta*funcs[i](xv,t);
		ktemp[i]=xv[i]+k[i]*0.5;
	}
	for(var i=0;i<count;i++)
	{
		k[count+i]=delta*funcs[i](ktemp,t+delta*0.5);
	}
	for(var i=0;i<count;i++)
	{
	   ktemp[i] = xv[i] + k[count + i] * 0.5;
	}
    var count2 = count +count;
    for (var i = 0; i < count; i++)
    {	
    	k[count2 + i] = delta*funcs[i](ktemp, t + delta*0.5);
    }
    for(var i=0;i<count;i++)
 	{
       ktemp[i] = xv[i] + k[count2 + i];
	}
    var count3 = count + count2;
    for (var i = 0; i < count; i++)
        k[count3 + i] = delta*funcs[i](ktemp, t + delta);
    var koeff = 1.0 / 6.0;
    for (var i = 0; i < count; i++)
        xv[i] += koeff*(k[i] + 2.*(k[i + count] + k[i + count2]) + k[i + count3]);
}

var Model=(function(){
	var functions=new Array(2);
	var initial=new Array(2);

	function init(v0,x0,a,b,m)
	{
		functions[0]=function(x,t){
			return x[1];
		};
		functions[1]=function(x,t){
			return -x[1]*(a+b*x[1])/m;
		};
		initial[0]=x0;
		initial[1]=v0;
	}
	function setParameters(a,b,m)
	{
		functions[1]=function(x,t){
			return -x[1]*(a+b*x[1])/m;
		};
	}
	return {
		functions:functions,
		init:init,
		initial:initial,
		setParameters:setParameters
	}
})();


var modelTime=0;
var viewTime=0;
var fpsdelta=1000.0/30.0;
var physdelta=1000.0/60.0;
var frameID;
var data=null;
var tClean=0;
var drawdelta=1000;
var epsilon=0.005;
var v_data=null;
var initial_v=0.0;
function start()
{
	Model.init((initial_v=parseFloat(velocity.value)),0,parseFloat(alpha.value),parseFloat(beta.value),parseFloat(mass.value));
	draw(Model.initial);
	viewTime=modelTime=performance.now();
	button.onclick=stop;
	button.value="Стоп";
	physdelta=parseFloat(document.getElementById("dt").value);
	data=[{x:[0],y:[0],type:'scatter',maxdisplayed:100}];
	v_data=[{x:[0],y:[Model.initial[1]],type:'scatter',maxdisplayed:100}];
	Plotly.newPlot('tester',data,{/*xaxis:{range:[0,1]},yaxis:{range:[0,1]}*/title:'Пройденный путь',xaxis:{title:'Время, с'},yaxis:{title:'Расстояние, м'}});
	Plotly.newPlot('velocity_graph',v_data,{/*xaxis:{range:[0,1]},yaxis:{range:[0,1]}*/title:'Скорость лодки',xaxis:{title:'Время, с'},yaxis:{title:'Скорость, м/с'}});
	j=0;
	tClean=0;
	drawdelta=document.getElementById('drawdt').value;
	epsilon=document.getElementById('v_epsilon').value;


	frameID=requestAnimationFrame(loop);
}
var canvas;
var ctx;
var button;
var alpha;
var beta;
var velocity;
var mass;
window.addEventListener('load',init);


var svg;
var image;
var field;
var scene;
var zoom;
var zoomed;
var rect;
function initsvg()
{	

	d3.select('#svg_example').style("width","100%").style("height","200px")
	var block=document.getElementById('svg_example')

	svg = d3.select("#svg_example").append("svg").attr("class","grid_svg");
	field=svg.append('g')
	.attr("class", "field");

	rect=field.append("rect").style('fill','white');

    field.append("g")
    .attr("class", "x axis");

    field.append("g")
    .attr("class", "y axis");

    function redraw(){

	var width=block.clientWidth;
	var height=block.clientHeight;

	var margin = {top: 20, right: 20, bottom: 30, left: 40};
    width = width - margin.left - margin.right;
    height = height - margin.top - margin.bottom;

    var scaleKoeff=2.0/100.0;//2m is 100px

	var x = d3.scale.linear()
    .domain([-width*scaleKoeff / 2, width*scaleKoeff / 2])
    .range([0, width]);

	var y = d3.scale.linear()
    .domain([-height*scaleKoeff / 2, height*scaleKoeff / 2])
    .range([height, 0]);

	var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .ticks(4)
    .tickSize(-height);

	var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .ticks(4)
    .tickSize(-width);

	zoomed=function(){
  		field.select(".x.axis").call(xAxis);
  		field.select(".y.axis").call(yAxis);
   		scene.attr('transform',"translate(" + d3.event.translate + ") scale(" + d3.event.scale + ")");
		var d=scene.data();
		d[0].scale=d3.event.scale;
	}

    var im_h=100,im_w=100;
    image.attr('x',(width-im_w)*0.5)
    .attr('y',(height-im_h*1.3)*0.5)
    .attr('height',im_h)
    .attr('width',im_w);

	
	zoom=d3.behavior.zoom()
		.x(x)
		.y(y)
		.scaleExtent([1,4])
		.on('zoom',zoomed);

    svg.attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

  	field.attr("transform", "translate(" + margin.left + "," + margin.top + ")")
  	.call(zoom);


    field.select('rect')
    .attr("width", width)
    .attr("height", height);

    field.select('.x.axis')
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

	field.select('.y.axis')
    .call(yAxis);

    var d=image.data();
	image.attr('transform','translate('+d[0].translate[0]+','+d[0].translate[1]+') scale('+d[0].scale+')');
	
	d=scene.data()[0];
	zoom.translate([d.translate[0],d.translate[1]]).scale([d.scale]).event(field);
	}
	scene=field.append('g')
	.attr('id','scene');

    image=scene.append('svg:image')
    .attr('preserveAspectRation','xMidYMid')
    .attr('xlink:href','https://upload.wikimedia.org/wikipedia/commons/d/d9/Cyclohexane-boat-2D-stereo-skeletal.png');
    
    scene.data([{translate:[0,0],scale:1}]);
    image.data([{translate:[0,0],scale:1}]);
    redraw();
    window.addEventListener('resize',redraw);

}


function init()
{
	button=document.getElementById("button");
	button.onclick=start;
	alpha=document.getElementById("alpha");
	beta=document.getElementById("beta");
	velocity=document.getElementById("velocity");
	mass=document.getElementById("mass");
	Plotly.newPlot('tester',[{x:[0],y:[0],type:'scatter',maxdisplayed:100}],{title:'Пройденный путь',xaxis:{title:'Время, с',range:[0,1]},yaxis:{title:'Расстояние, м',range:[0,1]}});	
	Plotly.newPlot('velocity_graph',[{x:[0],y:[0],type:'scatter',maxdisplayed:100}],{title:'Скорость лодки',xaxis:{title:'Время, с',range:[0,1]},yaxis:{title:'Скорость м/с',range:[0,1]}});

	initsvg();

}
function draw(initial)
{
	function moveImage(x,y)
	{
		image.data([{translate:[x*50,y*50],scale:1}]);
		image.attr('transform','translate('+x*50+','+y*50+')');
	}
	moveImage(initial[0],0);
	var scale=scene.data()[0].scale;
	//var rect=field.select('rect');
	var width=rect.attr('width');
	var height=rect.attr('height');
	var shift=scale*0.5-0.5;
	//scene.data([{translate:[-initial[0]*50*scale-width*shift,-height*shift],scale:scale}]);
	zoom.translate([(-initial[0]*50*scale-width*shift),-height*shift]).event(field);
	//field.call(zoom.transform,d3.zoomIdentity.translate());
}
var j=0;
function loop(timestamp)
{
	//console.log(modelTime);
	var mdt=(timestamp-modelTime);
	var vdt=(timestamp-viewTime);
	var i=0;
	var k=Math.max(1,Math.round(drawdelta/physdelta));
	
	if(timestamp>=(viewTime+fpsdelta))
	{
		draw(Model.initial);
		viewTime=timestamp-(vdt%fpsdelta);
	}
	while(mdt>=physdelta)
	{
		i++;
		RK4SolverStep(Model.initial,tClean*0.001,physdelta*0.001,Model.functions);
		j++;	
		tClean+=physdelta;
		modelTime+=physdelta;
		mdt-=physdelta;
		if(j>=k)//отрисовка
		{
			var layout={
				'xaxis.range[1]':tClean*0.001+1,
				'yaxis.range[1]':Model.initial[0]*1.1+1

			}
			if(data[0].x.length>500)//удаление лишних точек
			{
				data[0].x.splice(0,20);
				data[0].y.splice(0,20);
			}
			if(v_data[0].x.length>500)
			{
				v_data[0].x.splice(0,20);
				v_data[0].y.splice(0,20);
			}
			Plotly.extendTraces("tester",{x:[[tClean*0.001]],y:[[Model.initial[0]]]},[0]);
			Plotly.extendTraces("velocity_graph",{x:[[tClean*0.001]],y:[[Model.initial[1]]]},[0]);
			/*Plotly.animate('tester', {layout:layout}, {
   			 transition: {
     				 duration: 500,
     				 easing: 'cubic-in-out'
    					}
  					});*/
			Plotly.relayout("tester",layout);
			Plotly.relayout("velocity_graph",{'xaxis.range[1]':tClean*0.001+1,'yaxis.range[0]':Model.initial[1]-1.0});
			j=0;
		}
		if(i>10)
		{
			modelTime=timestamp;
			break;
		}

		//update(dt*0.001);
	}
	if(Model.initial[1]<0)
	{
				window.alert('Слишком большой шаг не позволяет получить сходящуюся к нулю скорость');
				stop(); 
				return;
	}
	if(Model.initial[1]<epsilon)//условие остановки
	{
		stop();
		return;
	}
	if(Math.abs(Model.initial[1])>Math.abs(initial_v))
	{
		window.alert('Текущий шаг не позволяет получить сходящееся решение');
		stop(); 
		return;
	}
	initial_v=Model.initial[1];
	frameID=requestAnimationFrame(loop);
}
function stop()
{
	cancelAnimationFrame(frameID);
	button.onclick=start;
	button.value="Старт";
}





