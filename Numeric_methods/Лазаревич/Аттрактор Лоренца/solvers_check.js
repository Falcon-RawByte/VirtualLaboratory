



SolversCheck=(function(){
var methodCollection=document.getElementById('methodCollection');
var startButton=document.getElementById('startButton');
var divs=new Array();
var methods=new Array();
var task=(function()
	{
		var values;
		var functions;



		return {values:values,functions:functions};
	})();
function init()
{
	methods.push({method:RK4System,name:'RK4'});
	methods.push({method:MidpointSystem,name:'Midpoint'});
	methods.push({method:ImplicitEulerSystem,name:'ImplicitEuler'});
	methods.push({method:ExplicitEulerSystem,name:'ExplicitEuler'});
	methods.push({method:Trapezoidal,name:'Trapezoidal'});
	methods.push({method:Ralston,name:'Ralston'});
	methods.push({method:VelocityVerlet,name:'VelocityVerlet'});
	methods.push({method:StormerVerlet,name:'StormerVerlet'});
	methods.push({method:SemiImplicitEuler,name:'SemiImplicitEuler'});
};
init();
var frameID;
function AddMethod()
{
	var methodEditor=document.createElement('div');
	methodEditor.className="methodEditor";
	methodEditor.innerHTML=`
			<div style="display: table;border-spacing:5px;">
				<div class="table_row">	
				<label class="table_label">Метод</label>
					<select class="table_input method">
					<optgroup label="General">
					<option value="0" selected>RK4</option>
					<option value="1">Midpoint</option>
					<option value="2">ImplicitEuler</option>
					<option value="3">ExplicitEuler</option>
					<option value="4">Trapezoidal</option>
					<option value="5">Ralston</option>
					</optgroup>
					<optgroup label="Special">
					<option value="6">VelocityVerlet</option>
					<option value="7">StormerVerlet</option>
					<option value="8">SemiImplicitEuler</option>
					</optgroup>
					</select>
				</div>
				<div class="table_row">	
					<label class="table_label">Мин. шаг, мс</label>
					<input class="table_input minStep" type="number" value="0.1" step="0.1">
				</div>
				<div class="table_row">	
					<label class="table_label">Макс. шаг, мс</label>
					<input class="table_input maxStep" type="number" value="10" step="0.1">
				</div>
				<div class="table_row">	
					<label class="table_label">Допустимая ошибка</label>
					<input class="table_input error" type="number" value="20" step="10">
				</div>
				<div class="table_row">	
					<label class="table_label">Цвет</label>
					<input class="table_input color" type="color" value="#0000FF">
				</div>
			</div>`;
	var removeButton=document.createElement('input');
	removeButton.type="Button";
	removeButton.value="Удалить";
	removeButton.className="removeMethodButton";
	removeButton.onclick=(function()
	{
		var block=methodEditor;
		return function(){
			methodCollection.removeChild(block);
		};
	})();
	methodEditor.appendChild(removeButton);
	methodCollection.appendChild(methodEditor);
}
var timer=0;
var solvers=null;
function StartSolving()
{
	var temp=document.getElementsByClassName('methodEditor');
	if(temp.length==0)
		return;
	solvers=new Array(temp.length);
	temp.forEach(function(i,item)
		{
			solvers[i]={
			method:methods[item.getElementsByClassName('method')[0].selectedIndex],
			minStep:parseFloat(item.getElementsByClassName('minStep')[0].value),
			maxStep:parseFloat(item.getElementsByClassName('maxStep')[0].value),
			Error:parseFloat(item.getElementsByClassName('error')[0].value),
			Color:item.getElementsByClassName('color')[0].value,
			data:values.slice()
			};
		});
	startButton.value="Стоп";
	startButton.onclick=StopSolving;
	timer=performance.now();
	frameID=requestAnimationFrame(loop);
}
var physdelta=1000/60;
function Solving(timestamp)
{
	var mdt=(timestamp-timer);
	var k=Math.max(1,Math.round(drawdelta/physdelta));
	if(mdt>=physdelta)
	{
		solvers.forEach(function(){




		});
		RK4SolverStep(Model.initial,modelTime,physdelta*0.001,Model.functions);
		//modelTime+=physdelta;
		tClean+=physdelta;
			
			/*data.x.push(tClean);
			data.y.push(Model.initial[0]);*/
			var layout={
				'xaxis.range[1]':tClean*0.001+1,
				'yaxis.range[1]':Model.initial[0]*1.1+1

			}
			//Plotly.update("tester",{data},layout)
			if(data[0].x.length>100)
			{
				/*data[0].x.shift();
				data[0].y.shift();*/
				data[0].x.splice(0,20);
				data[0].y.splice(0,20);
			}
			if(v_data[0].x.length>100)
			{
				/*v_data[0].x.shift();
				v_data[0].y.shift();*/
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

		//update(dt*0.001);
	}
	timer=timestamp;
	frameID=requestAnimationFrame(loop);
}
function StopSolving()
{

	cancelAnimationFrame(frameID);
	startButton.value="Старт";
	startButton.onclick=StartSolving;
}
startButton.value="Старт";
startButton.onclick=StartSolving;
return{AddMethod:AddMethod,StartSolving:StartSolving,StopSolving:StopSolving};
})();

