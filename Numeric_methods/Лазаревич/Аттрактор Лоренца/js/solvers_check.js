

SolversCheck=(function(){
var methodCollection=document.getElementById('methodCollection');
var startButton=document.getElementById('startButton');
var divs=new Array();
var methods=new Array();
var task=(function()
	{
		var params={sigma:10,r:28,b:8/3};
		var values=new Array();
		var functions=new Array();
		values.push(1);//x
		values.push(0);//y
		values.push(0);//z
		functions.push(function(x,t)
			{
				return params.sigma*(x[1]-x[0]);
			});
		functions.push(function(x,t)
			{
				return x[0]*(params.r-x[2])-x[1];
			});
		functions.push(function(x,t)
			{
				return x[0]*x[1]-params.b*x[2];
			});
		return {values:values,functions:functions};
	})();
function init()
{
	methods.push({method:RK4System,name:'RK4'});
	methods.push({method:MidpointSystem,name:'Midpoint'});
	methods.push({method:ImplicitEulerSystem,name:'ImplicitEuler'});
	methods.push({method:ExplicitEulerSystem,name:'ExplicitEuler'});
	methods.push({method:ExplicitTrapezoidal,name:'ExplicitTrapezoidal'});
	methods.push({method:Ralston,name:'Ralston'});
	methods.push({method:ImplicitEulerJacobian,name:'ImplicitEulerJacobian'});
	methods.push({method:ImplicitMidpoint,name:'ImplicitMidpoint'});
	methods.push({method:ImplicitTrapezoidal,name:'ImplicitTrapezoidal'});
	methods.push({method:ImplicitRadauI5,name:'ImplicitRadauI5'});

	/*methods.push({method:VelocityVerlet,name:'VelocityVerlet'});
	methods.push({method:StormerVerlet,name:'StormerVerlet'});
	methods.push({method:SemiImplicitEuler,name:'SemiImplicitEuler'});*/
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
					<option value="4">ExplicitTrapezoidal</option>
					<option value="5">Ralston</option>
					<option value="6">ImplicitEulerJacobian</option>
					<option value="7">ImplicitMidpoint</option>
					<option value="8">ImplicitTrapezoidal</option>
					<option value="9">ImplicitRadauI5</option>
					</optgroup>
					</select>
				</div>
				<div class="table_row">	
					<label class="table_label">Мин. шаг, мс</label>
					<input class="table_input minStep" type="number" value="20" step="0.1">
				</div>
				<div class="table_row">	
					<label class="table_label">Макс. шаг, мс*</label>
					<input class="table_input maxStep" type="number" value="10" step="0.1">
				</div>
				<div class="table_row">	
					<label class="table_label">Допустимая ошибка*</label>
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
	data =new Array(temp.length);
	for(var i=0;i<temp.length;i++)
		{
			var item=temp[i];
			solvers[i]={
			method:methods[item.getElementsByClassName('method')[0].selectedIndex],
			minStep:parseFloat(item.getElementsByClassName('minStep')[0].value),
			maxStep:parseFloat(item.getElementsByClassName('maxStep')[0].value),
			Error:parseFloat(item.getElementsByClassName('error')[0].value),
			Color:item.getElementsByClassName('color')[0].value,
			data:task.values.slice(),
			localTime:performance.now(),
			modelTime:performance.now()
			};
			data[i]={type:'scatter3d',marker:{size:1.0,color:solvers[i].Color},line:{color:solvers[i].Color},name:solvers[i].method.name,x:[task.values[0]],y:[task.values[1]],z:[task.values[2]]};
		}
	Plotly.newPlot('graph',data,{/*xaxis:{range:[0,1]},yaxis:{range:[0,1]}*/title:'xy',xaxis:{title:'x'},yaxis:{title:'y'}});
	startButton.value="Стоп";
	startButton.onclick=StopSolving;
	timer=performance.now();
	frameID=requestAnimationFrame(Solving);
}
var data=[{type:'scatter'}];
var physdelta=1000/60;
var modelTime=0;
function Solving(timestamp)
{
		//RK4SolverStep(Model.initial,modelTime,physdelta*0.001,Model.functions);
		modelTime+=physdelta;
			/*data.x.push(tClean);
			data.y.push(Model.initial[0]);*/
			solvers.forEach(function(item,i)
			{
				var mdt=timestamp-item.modelTime;
			if(mdt>=item.minStep)
			{
				item.method.method.Step(item.data,item.modelTime*0.001,item.minStep*0.001,task.functions);
				item.modelTime+=item.minStep;
			if(data[i].x.length>1000)
			{
				/*data[0].x.shift();
				data[0].y.shift();*/
						data[i].x.splice(0,200);
						data[i].y.splice(0,200);
			}
			Plotly.extendTraces("graph",{x:[[item.data[0]]],y:[[item.data[1]]],z:[[item.data[2]]]},[i]);
			item.localTime=timestamp;
			}
			});
			//Plotly.update("tester",{data},layout)
		//update(dt*0.001);
	timer=timestamp;
	frameID=requestAnimationFrame(Solving);
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
