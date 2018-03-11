
var Task=(function()
{
	var taskBlock;
	var taskModel;
	var initialValuesTable;
	var parametersTable;
	var plotDivs;
	var stiffnessPlot;
	var errorPlot;
	function createInputsTable(divId,values,argument)
	{
		var div=document.getElementById(divId);
		var divTable=document.createElement('div');
		divTable.style="display: table;border-spacing:5px;border:1px solid black;margin:5px";
		var inputs=new Array();
		function valueInput(obj)
		{
			var input=document.createElement('input');
			input.type='number';
			input.className='table_input';
			if(obj.min!==undefined)
			{
				input.min=obj.min;
			}
			if(obj.max!==undefined)
			{
				input.max=obj.max;
			}
			if(obj.name!==undefined)
			{
				input.id=obj.name;
			}
			if(obj.step!==undefined)
			{
				input.step=obj.step;
			}
			if(obj.default!==undefined)
			{
				input.value=obj.default;
			}else
			{
				input.value=0;
			}
			return input;
		}
		function prepareInput(item,index)
		{
			var table_row=document.createElement('div');
			table_row.className='table_row';
			divTable.appendChild(table_row);
			var label=document.createElement('label');
			label.className="table_label";
			if(item.description!=undefined)
				label.appendChild(document.createTextNode(item.description));
			else
				label.appendChild(document.createTextNode('Error: missing a parameter description'));
			var input=valueInput(item);
			input.setAttribute('index',index);
			table_row.appendChild(label);
			table_row.appendChild(input);
			divTable.appendChild(table_row);
			inputs.push(input);
		}
		values.forEach(prepareInput);
		if(argument!==undefined)
			{
				prepareInput(argument[0],values.length);
				prepareInput(argument[1],values.length+1);
			}
		div.appendChild(divTable);
		return {table:divTable,inputs:inputs};
	}
	function init(divId)
	{
		taskBlock=document.getElementById(divId);
			//taskBlock.style.width='100%';
			//taskBlock.style.display='block';
			taskModel=(function()
			{
				var parameters=[{name:'u',description:'Параметр \u03bc',default:20,step:'0.1'}];
				var values=[{name:'x',description:'Начальная позиция',default:1},{name:"x'",description:'Начальная скорость',default:0}];//x,x'
				var argument=[{name:'t',description:'Начальное время',default:0},{name:'dt',description:'Продолжительность',default:10,min:0,max:500}];
				//var plot=[{x:'t',y:'x'},{x:'x',y:"x'"}];
				var argumentName='Время';
				var plot=[{x:{index:values.length,description:'Время'},y:{index:0,description:'Значение X'},description:'График изменения x'},{x:{index:0,description:'Значение X'},y:{index:1,description:"Значения X'"},description:'Фазовый портрет'}];
				var taskInfo={name:'Осциллятор Ван-дер-Поля',description:'Здесь должно быть описание задачи'};
				function getFunctions(parameters)
				{
					var functions=new Array(2);
					functions[0]=function(x,t)
					{
						return x[1];
					};
					functions[1]=function(x,t)
					{
						var u=parameters[0];
						var x0=x[0];
						var v0=x[1];
						return u*(1-x0*x0)*v0-x0;
					};
					return functions;
				}
				function getJacobian(parameters)
				{
					var jacobian=
					[
						function(xv,t)
						{
							return 0;
						},
						function(xv,t)
						{	
							return 1;
						}
						,
						function(xv,t)
						{
							var u=parameters[0];
							return -1-2.0*u*xv[0]*xv[1];
						},
						function(xv,t)
						{
							var u=parameters[0];
							var x0=xv[0];
							return u*(1-x0*x0);
						}
					];
					return jacobian;
				};
					return {parameters:parameters,argumentName:argumentName,values:values,argument:argument,plot:plot,getFunctions:getFunctions,getJacobian:getJacobian};
				})();
				/*taskModel.values.forEach(function(item)
				{
					initialValuesInputs.push(valueInput(item));
				});
				for(var key in taskModel.parameters)
				{
					parametersInputs.push(valueInput(taskModel.parameters[key]));
				}*/
				/*
				taskModel.parameters.forEach(function(item)
				{
					parametersInputs.push(valueInput(item));
				});*/
				//var taskDescription=document.createElement('div');
				//taskDescription.id="taskDescription";
				initialValuesTable=createInputsTable('TaskInitials',taskModel.values,taskModel.argument);
				parametersTable=createInputsTable('TaskParameters',taskModel.parameters);
				if(taskModel.parameters.length==0)
				{
					document.getElementById("TaskParameters").style.display="none";
				}
				function createPlot(divId,plotArray,values,argument)
				{
					var div=document.getElementById(divId);
					var divPlot=document.createElement('div');
					var plots=new Array();
					plotArray.forEach(function(item)
					{
						var graphBlock=document.createElement('div');
						//graphBlock.style.display="inline-block";
						//graphBlock.style.width='500px';
						//graphBlock.style.height='500px';
						graphBlock.width='350px';
						graphBlock.height='500px';
						graphBlock.style="display:inline-block;";
						graphBlock.style="display:none;margin:auto;";
						divPlot.appendChild(graphBlock);
						graphBlock.indexes=[item.x.index,item.y.index];
						if(item.z!==undefined){
							graphBlock.indexes.push(item.z.index);
							Plotly.newPlot(graphBlock,[{x:[],y:[],z:[],type:'scatter3d',maxdisplayed:10000}],{showlegend:true,title:item.description,xaxis:{title:item.x.description},yaxis:{title:item.y.description}});
						}else
						{
							Plotly.newPlot(graphBlock,[{x:[],y:[],type:'scatter',maxdisplayed:10000}],{showlegend:true,title:item.description,xaxis:{title:item.x.description},yaxis:{title:item.y.description}});
						}
						plots.push(graphBlock);
					});
					errorPlot=document.createElement('div');
					errorPlot.style="display:none;margin:auto";
					Plotly.newPlot(errorPlot,[{x:[],y:[],type:'scatter',maxdisplayed:10000}],{showlegend:true,title:"График ошибки",xaxis:{title:"Время"},yaxis:{title:"Ошибка"}});
					var errorDiv=document.getElementById("errorDiv")
					errorDiv.appendChild(errorPlot);
					div.appendChild(divPlot);
					plotDivs=plots;
				}
				createPlot('solutions',taskModel.plot,taskModel.values,taskModel.argument);

				var stiffness=document.getElementById("stiffness");
				stiffnessPlot=document.createElement("div");
				stiffnessPlot.style="display:none;margin:auto;";
				Plotly.newPlot(stiffnessPlot,[{x:[],y:[],type:'scatter',maxdisplayed:10000}],{showlegend:true,title:'График максимальных собственных значений',xaxis:{title:taskModel.argumentName},yaxis:{title:"max lambda"}});
				stiffness.appendChild(stiffnessPlot);

			}
		function getTaskData()
		{
			var values=new Array();//get values from inputs
			var parameters=new Array();
			initialValuesTable.inputs.forEach(function(item)
			{
				values.push(parseFloat(item.value));
			});
			parametersTable.inputs.forEach(function(item)
			{
				parameters.push(parseFloat(item.value));
			});
			var argumentDelta=values.pop();
			var argument=values.pop();

			var data={values:values,argument:argument,plot:taskModel.plot,argumentDelta:argumentDelta,parameters:parameters,functions:taskModel.getFunctions(parameters)};
			if(taskModel.getJacobian!==undefined)
			{
				data.jacobian=taskModel.getJacobian(parameters)
			}
			return data;
		}
		function getOptions(options,values,argument,parameters)
		{
			var jacobian;
			if(options.jacobianCalc==1&&taskModel.getJacobian!==undefined)
			{
				options.jacobianCalc=true;
			}
			return options;
		}

			function resetPlots()
			{
				plotDivs.forEach(function(item)
				{
					//Plotly.deleteTraces(item);
					item.data=[[]];
					Plotly.restyle(item,{});
				});
				stiffnessPlot.data=[[]];
				Plotly.restyle(stiffnessPlot,{});
				errorPlot.data=[[]];
				Plotly.restyle(errorPlot,{});
				errorPlot.style="display:none";

			}
			function calcStiffness(data,jacobian)
			{
				var count=data[0].length;
				var stiffData=new Array(count);
				var rank=data.length-1;
				var matrix=new Array(rank*rank);
				var jacobianStep=0.01;
				for(var i=0;i<count;i++)
				{
					var vector=new Array();
					for(var j=0;j<rank;j++)
						vector[j]=data[j][i];
					for(var j=0;j<rank;j++)
					{
						for(var k=0;k<rank;k++)
						{
							if(taskModel.getJacobian!==undefined)
								matrix[j*rank+k]=jacobian[j*rank+k](vector,data[rank][i]);
							else
							{
								var y_temp=y[i];
								var df=(jacobian[j](vector,data[rank][i]));
								vector[k]+=jacobianStep;
								df=(jacobian[j](vector,data[rank][i])-df);
								df/=step;
								matrix[k+j*count]=df;
							}
						}
					}
					var eigenValues=QRAlgorithm(matrix,rank,40);
					var max=0.0;
					for(var j=0;j<rank;j++)
					{
						var current=Math.abs(eigenValues.values[j]);
						if(current>max)
							max=current;
					}
					stiffData[i]=max;
				}
				return stiffData;
			}
			function drawLambdaPlot(data,methodName,methodColor,jacobian,index)
			{
				var stiffData=calcStiffness(data,jacobian);
				//calc stiffness
				stiffnessPlot.style.display="block";
				Plotly.addTraces(stiffnessPlot,{marker:{color:methodColor,size:4},line:{color:methodColor,shape:'linear'},name:methodName,x:data[data.length-1],y: stiffData,mode: 'lines+markers'}, index);
			}
			function drawPlot(data,index,methodName,methodColor)
			{
				index=Math.min(plotDivs[0].data.length);
				plotDivs.forEach(function(item)
				{
					item.style.display="block";
					if(item.indexes.length==3)
						Plotly.addTraces(item, {marker:{color:methodColor,size:4},line:{color:methodColor,shape:'linear'},name:methodName,x:data[item.indexes[0]],y: data[item.indexes[1]],mode: 'lines+markers',z:data[item.indexes[2]]}, index);
					else
						Plotly.addTraces(item, {marker:{color:methodColor,size:4},line:{color:methodColor,shape:'linear'},name:methodName,x:data[item.indexes[0]],y: data[item.indexes[1]],mode: 'lines+markers'}, index);
				});	
			}
			function drawErrorPlot(data,index,methodName,methodColor)
			{
				errorPlot.style.display="block";
				Plotly.addTraces(errorPlot, {marker:{color:methodColor,size:4},line:{color:methodColor,shape:'linear'},name:methodName,x:data[1],y: data[0],mode: 'lines+markers'}, index);
			}
		return {init:init,taskModel:taskModel,getTaskData:getTaskData,getOptions:getOptions,resetPlots:resetPlots,drawLambdaPlot:drawLambdaPlot,drawPlot:drawPlot,drawErrorPlot:drawErrorPlot};
	})();



var MethodPicker = (function ()//done
{
	var methods;

	var methodsStack;
	var methodsCount = 0;
	var addingTable;
	var optionsGetters = {
		chooseOrder: function (MethodTable) {
			var data = {};
			var selector = MethodTable.getElementsByClassName('Orders')[0];
			data.maxOrder = selector.options[selector.selectedIndex];
			return data;
		},
		useJacobian: function (MethodTable) {
			var data = {};
			data.jacobianCalc = MethodTable.getElementsByClassName('jacobianCalc')[0].value;
			data.jacobianConst = MethodTable.getElementsByClassName('jacobianConst')[0].checked;
			return data;
		},
		autoStep: function (MethodTable) {
			var data = {};
			data.minStep = parseFloat(MethodTable.getElementsByClassName('step')[0].value) * 0.001;
			data.maxStep = parseFloat(MethodTable.getElementsByClassName('maxStep')[0].value) * 0.001;
			data.errorTolerance = parseFloat(MethodTable.getElementsByClassName('errorTolerance')[0].value);
			return data;
		}
	};
	var methodOptionsSetters = {
		color: function (MethodTable, value) {
			//var selector=MethodTable.getElementsByClassName('Orders')[0];
			//selector.;
			//data.maxOrder=selector.options[selector.selectedIndex];

		}
		, step: function (MethodTable, value) {
			MethodTable.getElementsByClassName('step')[0].checked
		}, minStep: function (MethodTable, value) {
			//do nothing;
			MethodTable.getElementsByClassName('minStep')[0].value = 1000.0 * value;

		}, maxStep: function (MethodTable, value) {
			MethodTable.getElementsByClassName('maxStep')[0].value = 1000.0 * value;
		}, errorTolerance: function (MethodTable, value) {
			MethodTable.getElementsByClassName('errorTolerance')[0].value = value;

		}, jacobianCalc: function (MethodTable, value) {
			MethodTable.getElementsByClassName('jacobianCalc')[0].value = value;
		}
		, jacobianConst: function (MethodTable, value) {
			MethodTable.getElementsByClassName('jacobianConst')[0].checked = value;
		}
	};
	var methodOptionsSelect = {
		chooseOrder: function (MethodTable, method) {
			var options;
			var selector = MethodTable.getElementsByClassName('Orders')[0];
			selector.innerHTML = "";
			method.Orders.forEach(function (item) {
				var option = document.createElement('option');
				option.value = item;
				option.appendChild(document.createTextNode(item));
				selector.appendChild(option);
			});
			MethodTable.getElementsByClassName('chooseOrder')[0].style.visibility = "visible";


		},
		useJacobian: function (MethodTable, method) {
			MethodTable.getElementsByClassName('useJacobian')[0].style.visibility = "visible";
		},
		autoStep: function (MethodTable, method) {
			MethodTable.getElementsByClassName('autoStep')[0].style.visibility = "visible";
		}
	};
	function init(methodList)//map name:method
	{
		addingTable = document.getElementById("methodAddingTable");
		methodsStack = document.getElementById("methodsStack");
		var selector = addingTable.getElementsByClassName('method_select')[0];
		//add options for methods

		function onMethodSelect(MethodTable, selectedIndex) {
			var options = MethodTable.getElementsByClassName("table_row_group");
			for (var i = 0; i < options.length; i++) {
				options[i].style.visibility = "hidden"
			}
			methods[selectedIndex].optionsBlocks.forEach(function (item) {
				item(MethodTable, methods[selectedIndex].method);
			});
			//select all tablegroups
			//hide all
			//show used
			//if varOrder
			//fill selector

		}
		selector.onchange = function (e) {
			onMethodSelect(addingTable, this.selectedIndex);
		}
		methods = new Array();

		for (var key in methodList) {
			var m = methodList[key];
			methods.push({ methodKey: key, method: m });
		}

		methods.forEach(function (item, i) {
			var option = document.createElement('option');
			option.value = i;
			option.appendChild(document.createTextNode(item.method.attributes.name === undefined ? 'undefined' : item.method.attributes.name));
			selector.appendChild(option);
			var arr = new Array();
			if (item.method.hasOwnProperty('options')) {
				item.method.options.forEach(function (item, i) {
					arr.push(methodOptionsSelect[item]);
				});
			}
			methods[i].optionsBlocks = arr;
		});
		var addButton = document.getElementById("methodAddButton");
		addButton.onclick = function () {
			var form = document.getElementById('methodsForm1');
			if (!form.reportValidity())
				return;
			var self = this;
			if (methodsCount == 3) {
				this.setAttribute('disabled', "");
			}
			if (methodsCount < 4) {
				methodsCount++;
				var methodBlock = document.getElementById("methodBlockTemplate").children[0].cloneNode(true);
				methodBlock.getElementsByClassName("methodBlockName")[0].innerHTML = methods[selector.selectedIndex].method.attributes.name;// /a*s/d*a/sd*a/sd*;
				methodBlock.getElementsByClassName("methodBlockColor")[0].style.backgroundColor = addingTable.getElementsByClassName("color")[0].value;

				methodBlock.getElementsByClassName("methodBlockRemove")[0].onclick = function () {
					methodsStack.removeChild(methodBlock);
					if (methodsCount == 4)
						self.removeAttribute("disabled");
					methodsCount--;
				}
				var methodTable = addingTable.cloneNode(true);
				methodTable.removeAttribute('id');
				methodTable.className = "methodTable";
				var innerSelector = methodTable.getElementsByClassName('method_select')[0];
				innerSelector.selectedIndex = selector.selectedIndex;
				//add options for methods
				var colorInput = methodTable.getElementsByClassName("color")[0];

				methodTable.getElementsByClassName("jacobianCalc")[0].selectedIndex = addingTable.getElementsByClassName("jacobianCalc")[0].selectedIndex;
				methodTable.getElementsByClassName("Orders")[0].selectedIndex = addingTable.getElementsByClassName("Orders")[0].selectedIndex;

				var table_row = document.createElement('div');
				var input = document.createElement("input");
				var label = document.createElement("label");
				label.appendChild(document.createTextNode('Использовать как основной'));
				input.type = "radio";
				input.name = "mainMethod";
				if (methodsCount == 1)
					input.setAttribute("checked", "");
				table_row.className = "table_row";
				input.className = "table_input mainMethod";
				label.className = "table_label";
				table_row.appendChild(label);
				table_row.appendChild(input);
				methodTable.appendChild(table_row);
				colorInput.onchange = function (e) {
					methodBlock.getElementsByClassName("methodBlockColor")[0].style.backgroundColor = this.value;
				}
				methodBlock.getElementsByClassName("methodBlockBody")[0].appendChild(methodTable);
				innerSelector.onchange = function (e) {
					onMethodSelect(methodTable, this.selectedIndex);
					methodBlock.getElementsByClassName("methodBlockName")[0].innerHTML = methods[innerSelector.selectedIndex].method.attributes.name;
				}
				methodsStack.appendChild(methodBlock);
			}
		}
		/*selectList.onchange=function(e)
		{
			console.log('fire');
			for(var key in this.optionsBlocks)
			{
				this.optionsBlocks[key].style.display='none';
			}
			methods[e.value].optionsBlocks.forEach(function(item,i)
			{
				item.style.display="";
			});
		};*/
		selector.dispatchEvent(new Event('change'));
	}
	function collectChoosenMethods() {

		if (!methodsStack.reportValidity())
			return [];
		return collectPresetMethods();
		/*var tempMethods=methodsStack.getElementsByClassName('methodTable');
		if(tempMethods.length==0)
			return [];
		var choosenMethods=new Array(tempMethods.length);
			//Task.get
		for(var i=0;i<tempMethods.length;i++)
		{
			var item=tempMethods[i];
			var values;
			var select=item.getElementsByClassName('method_select')[0];
			var temp={
				method:methods[select.selectedIndex],
				step:parseFloat(item.getElementsByClassName('step')[0].value)*0.001,
				color:item.getElementsByClassName('color')[0].value,
				options:{}
			};
			if(item.getElementsByClassName('mainMethod')[0].checked)
			{	
				temp.checked=true;
			}
			if(temp.method.method.hasOwnProperty('options'))
			{
				temp.method.method.options.forEach(function(item2,i)
				{
					var data=optionsGetters[item2](item);
					for(var key in data)
					{
						temp['options'][key]=data[key];
					}
					//item.style.display="";
				});
			}
				choosenMethods[i]=temp;
		}
		return choosenMethods;*/
	}
	function loadPreset(preset) {
		//clear all methods
		methodsStack.innerHTML = "";
		//for each method in preset create 


		//set parameters

	}
	function collectPresetMethods() {
		var tempMethods = methodsStack.getElementsByClassName('methodTable');
		if (tempMethods.length == 0)
			return [];
		var choosenMethods = new Array(tempMethods.length);
		//Task.get
		for (var i = 0; i < tempMethods.length; i++) {
			var item = tempMethods[i];
			var select = item.getElementsByClassName('method_select')[0];
			var temp = {
				method: methods[select.selectedIndex],
				step: parseFloat(item.getElementsByClassName('step')[0].value) * 0.001,
				color: item.getElementsByClassName('color')[0].value,
				options: {}
			};
			if (item.getElementsByClassName('mainMethod')[0].checked) {
				temp.checked = true;
			}
			if (temp.method.method.hasOwnProperty('options')) {
				temp.method.method.options.forEach(function (item2, i) {
					var data = optionsGetters[item2](item);
					for (var key in data) {
						temp['options'][key] = data[key];
					}
					//item.style.display="";
				});
			}
			choosenMethods[i] = temp;
		}
		return choosenMethods;
	}
	return { init: init, collectPresetMethods: collectPresetMethods, collectChoosenMethods: collectChoosenMethods, loadPreset: loadPreset };
})();


var Main = (function () {
	var startButton;
	var frameID;
	var timer;

	var presets = null;
	var presetsElements = null;
	function CalcError(dataMain, dataSecondary) {
		var count = dataMain.length;
		var iterMain = 0;
		var iterSecondary = 0;
		var countMain = dataMain[0].length;
		var countSecondary = dataSecondary[0].length;
		var errorData = new Array(2);
		for (var i = 0; i < 2; i++) {
			errorData[i] = new Array();
		}
		errorData[0].push(0);
		errorData[1].push(dataMain[count - 1][0]);
		//add first
		iterMain++;
		iterSecondary++;
		while (iterMain < countMain && iterSecondary < countSecondary) {
			var errorValue;
			var t;
			if (dataMain[count - 1][iterMain] < dataSecondary[count - 1][iterSecondary]) {
				//interpolate secondary current and last
				var x1 = dataSecondary[count - 1][iterSecondary - 1];
				var x2 = dataSecondary[count - 1][iterSecondary];

				var y1 = dataSecondary[0][iterSecondary - 1];
				var y2 = dataSecondary[0][iterSecondary];

				//y~=y1-x1+dy/dx*x~
				t = dataMain[count - 1][iterMain];
				var y_s = y1 + (y2 - y1) / (x2 - x1) * (t - x1);
				errorValue = Math.abs(y_s - dataMain[0][iterMain]);

				iterMain++;
			} else if (dataMain[count - 1][iterMain] > dataSecondary[count - 1][iterSecondary]) {
				//ignore this situation, because only main points are useful
				iterSecondary++;
				continue;


				//interpolate Main current and last
				var x1 = dataMain[count - 1][iterMain - 1];
				var x2 = dataMain[count - 1][iterMain];

				var y1 = dataMain[0][iterMain - 1];
				var y2 = dataMain[0][iterMain];

				//y~=y1+dy/dx*x~
				t = dataSecondary[count - 1][iterSecondary];
				var y_m = y1 + (y2 - y1) / (x2 - x1) * (t - x1);
				errorValue = Math.abs(y_m - dataSecondary[0][iterSecondary]);
				iterSecondary++;
			} else {
				//calc and add error
				t = dataMain[count - 1][iterMain];
				errorValue = Math.abs(dataMain[0][iterMain] - dataSecondary[0][iterSecondary]);
				iterMain++;
				iterSecondary++;
			}
			errorData[0].push(errorValue);
			errorData[1].push(t);
		}
		return errorData;
	}
	function createPresetElement(preset) {
		var element = document.createElement('div');
		element.className = "Preset";
		var label = document.createElement('label');
		label.appendChild(document.createTextNode(name));
		element.appendChild(label);
		var methods = document.createElement('div');
		methods.className = "PresetMethods";

		preset.methods.forEach(function (item) {
			var method = document.createElement('div');
			method.className = "PresetMethod";
			method.appendChild(document.createTextNode(item.name));
			methods.appendChild(method);
		});
		if (data.parameters.length != 0) {
			var PresetParams = document.createElement('div');
			var taskParams = Task.taskModel.parameters;
			//var data={values:values,argument:argument,plot:taskModel.plot,argumentDelta:argumentDelta,parameters:parameters,functions:taskModel.getFunctions(parameters)};
			preset.parameters.forEach(function (item, i) {
				var param = document.createElement('div');
				param.className = "PresetParam";
				param.appendChild(document.createTextNode(taskParams[i].description + ": " + item));
				PresetParams.appendChild(param);
			});
		}
		var taskValues = Task.taskModel.values;
		var taskArgument = Task.taskModel.argument;
		taskValues.forEach(function (item, i) {
			var value = document.createElement('div');
			value.className = "PresetParam";
			value.appendChild(document.createTextNode(item.description + ": " + preset.values[i]));
			PresetParams.appendChild(param);
		});
		var j = taskValues.length;
		for (var i = 0; i < 2; i++ , j++) {
			var value = document.createElement('div');
			value.className = "PresetParam";
			value.appendChild(document.createTextNode(taskArgument[i].description + ": " + preset.values[j]));
			PresetParams.appendChild(param);
		}
		/*<div class="Preset" id="PresetExample" style="display:none">
							<label class="PresetName"></label>
							<div class="PresetMethods">
								<div class="PresetMethod">Метод 1
								</div>
							</div>
							<div class="PresetParams">
								<div class="PresetParam">Параметр 1: значение</div>
							</div>
							<button >Загрузить</button>
							<button >Удалить</button>
						</div>*/

		var button = document.createElement("button");
		button.appendChild(document.createTextNode('Загрузить'));
		button.onclick = function () {
			PresetLoad(presets.indexOf(preset));
			//use index of
			//call methodPicker loadPreset and Task loadPreset
		}
		element.appendChild(button);
		button = document.createElement("button");
		button.appendChild(document.createTextNode('Удалить'));
		button.onclick = function () {
			PresetRemove(presets.indexOf(preset));
			//use index of
		}
		element.appendChild(button);
	}
	function PresetAdd() {

		if (presets.length < 5) {
			/**/
			//collect methods and params
			//save them
			var solvers = MethodPicker.collectPresetMethods();
			var data = Task.getTaskData();
			var preset_t = { methods: [] };
			solvers.forEach(function (item) {
				//	var method_t=Object.assign({name:,color:,step:},item.options})
				preset_t.methods.push(method_t);
			});
			//{methods:{methodName,param1:,param2:,param3:},,,}
			preset_t.parameters = data.parameters;
			preset_t.values = data.values.splice;
			preset_t.values.push(data.argument[0]);
			preset_t.values.push(data.argument[1]);
			createPresetelement(preset_t);

			presets.push(preset_t);

			if (typeof (Storage) !== "undefined") {
				localStorage.setItem("VirtLabVanDerPole", JSON, stringify(presets));
			}
		}
	}
	function PresetRemove(index) {
		presets.splice(index, 1);
		if (typeof (Storage) !== "undefined") {
			localStorage.setItem("VirtLabVanDerPole", JSON, stringify(presets));
		}
	}
	function PresetsLoad() {
		if (typeof (Storage) !== "undefined") {
			presets = JSON.parse(localStorage.getItem('VirtLabVanDerPole'));
			if (presets == undefined)
				presets = new Array();
		} else {
			presets = new Array();
		}
	}
	function start() {
		/*if(worker)return;
		var functionBody = '('+workerCode+')()';
   		var functionBlob = new Blob([functionBody]);
   		var functionUrl = URL.createObjectURL(functionBlob);
		worker=new Worker(functionUrl);
		worker.onmessage=function(e)
		{
			var data=e.data;
			Task.drawPlot(data.data,data.index,solvers[data.index].method.name,solvers[data.index].color);
			counter--;
			if(counter==0)
			{
				console.log(stop);
				worker.terminate();
				worker=null;
			}
		}*/
		$("#errorBlock").css( "display", "none" );
		$("#lambdaBlock").css( "display", "none" );
		$("#functionBlock").css( "display", "none" );
		var solvers = MethodPicker.collectChoosenMethods();
		if (solvers.length == 0)
			return;
		var data = Task.getTaskData();//var data={values:values,argument:argument,plot:taskModel.plot,argumentLength:argumentLength,parameters:parameters,functions:taskModel.getFunctions(parameters)};

		Task.resetPlots();
		var counter = solvers.length;

		var mainSolver = 0;
		for (var i = 0; i < counter; i++) {
			if (solvers[i].checked == true) {
				mainSolver = i;
				break;
			}
		}
		var results={functionPlot:$("#funcGraph").prop("checked"),lambdaPlot:$("#stiffnessGraph").prop("checked"),errorPlot:$("#errorGraph").prop("checked")};
		$("#complexity").html("");
		if(results.functionPlot)
		{
			$("#functionBlock").css( "display", "block" );
		}
		if(results.lambdaPlot)
		{
			$("#lambdaBlock").css( "display", "block" );
		}
		if(results.errorPlot&&(solvers.length>1))
		{
			$("#errorBlock").css( "display", "block" );
		}
		startButton.value = "Стоп";
		startButton.onclick = stop;
		mainWorker.start(data, solvers, function (data, solver, index) {
			Task.drawPlot(data, index, solver.method.method.attributes.name, solver.color);
		},function(data, solver,  jacobian,index){
			Task.drawLambdaPlot(data,solver.method.method.attributes.name,solver.color,jacobian,index);
		}, stop, function (data, solver) {
				var complexity = document.getElementById("complexity");
				var div = document.createElement("div");
				div.appendChild(document.createTextNode(solver.method.method.attributes.name + ": "));
				div.appendChild(document.createElement('br'));
				div.appendChild(document.createTextNode("Вычислено правых частей: " + data.rightSideEvaluation));
				div.appendChild(document.createElement('br'));
				div.appendChild(document.createTextNode("Матриц решено: " + data.matrixSolving));
				div.appendChild(document.createElement('br'));
				div.appendChild(document.createTextNode("Средний шаг: " + Math.round(data.averageStep) + " мс"));
				complexity.appendChild(div);
				$("#complexityBlock").css( "display", "block" );
			}, mainSolver, CalcError, Task.drawErrorPlot,results);
		return;
	}
	var tasks;
	var index;
	var maxIndex;
	var dataArray;
	var currentTask;
	var solvers;
	var count;
	var maxPoints = 10000;
	var curPoints = 1;
	var progressBar;
	var mainIndex;
	function init() {
		progressBar = document.getElementById('progressBar');
		Task.init('TaskBlock');
		MethodPicker.init(Methods, Task.options);
		startButton = document.getElementById('startButton');
		startButton.onclick = start;
		startButton.value = "Старт";
		presetsElements = new Array();
		//startButton.onclick=start;
		mainWorker.init(startButton, progressBar);
	}
	init();
	//var worker;
	function loop(timestamp) {
		var dt = timestamp - timer;
		if (/*dt>10.000*/true) {
			if (currentTask.t0 < currentTask.t1 && curPoints < maxPoints) {
				currentTask.method.Step(currentTask.values, currentTask.t0, currentTask.step, currentTask.functions, currentTask.options);
				for (var i = 0; i < count; i++) {
					dataArray[i].push(currentTask.values[i]);
				}
				currentTask.t0 += currentTask.step;
				dataArray[count].push(currentTask.t0);
				curPoints += count;
			} else {
				Task.drawPlot(dataArray, index, solvers[index].method.method.attributes.name, solvers[index].color);
				index++;
				if (index == maxIndex) {
					stop();
					return;
				}
				curPoints = 1;
				dataArray = new Array(count + 1);
				/*for(var k=0;k<=count;k++)
				{
					dataArray[k]=new Array();
				}*/
				currentTask = tasks[index];
				for (var k = 0; k < count; k++) {
				dataArray[k] = new Array();
					dataArray[k].push(currentTask.values[k]);
				}
				dataArray[count] = new Array();
				dataArray[count].push(currentTask.t0);
			}
			timer = timestamp;
		}
		frameID = requestAnimationFrame(loop);
	}
	function stop() {
		mainWorker.stop();
		startButton.value = "Старт";
		startButton.onclick = start;
		return;

		//worker = undefined;
	}
	return { start: start, stop: stop };
})();
//rosenbrock methods
//https://github.com/littleredcomputer/odex-js
//https://github.com/drewmiley/des-js


