
Task=(function()
{
	var taskBlock;
	var taskModel;
	var initialValuesTable;
	var parametersTable;
	var plotDivs;
	function createInputsTable(divId,values,blockName,argument)
	{
		var div=document.getElementById(divId);
		div.style.display="block";
		var divBlock=document.createElement('div');
		divBlock.style="display:inline-block;vertical-align:top";
		var divTable=document.createElement('div');
		divTable.style="display: table;border-spacing:5px;border:1px solid black;margin:5px";
		var inputs=new Array(values.length+1+1);
		var header=document.createElement('div');
		var headerLabel=document.createElement('div');
		headerLabel.style="display:table-cell;text-align:center";
		headerLabel.appendChild(document.createTextNode(blockName));
		header.className="table_row";
		header.appendChild(headerLabel);
		divTable.appendChild(header);
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
			input=valueInput(item);
			input.setAttribute('index',index);
			table_row.appendChild(label);
			table_row.appendChild(input);
			divTable.appendChild(table_row);
			inputs[index]=input;
		}
		values.forEach(prepareInput);
		if(argument!==undefined)
			{
				prepareInput(argument[0],values.length);
				prepareInput(argument[1],values.length+1);
			}
		divBlock.appendChild(divTable);
		div.appendChild(divBlock);
		return {table:divTable,inputs:inputs};
	}
	function init(divId,taskModel_in)
	{
		taskBlock=document.getElementById(divId);
			//taskBlock.style.width='100%';
			taskBlock.style.display='block';
			taskModel=taskModel_in;
			var taskDescription=document.createElement('div');
			taskDescription.id="taskDescription";
			var presets=document.createElement('div');
			presets.id="presets";
			taskBlock.appendChild(taskDescription);
			taskBlock.appendChild(presets);
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
				initialValuesTable=createInputsTable('taskBlock',taskModel.values,'Начальные значения',taskModel.argument);
				parametersTable=createInputsTable('taskBlock',taskModel.parameters,'Параметры');

			taskModel.presets.forEach(function(item,i)
			{
				var div=document.createElement('div');
				var label=document.createElement('label');
				label.appendChild(document.createTextNode(item.name));
				div.appendChild(label);
				var btn=document.createElement('button');
				btn.text='Применить';
				btn.class='presetBtn';
				div.className='presetDiv';
				btn.onclick=function()
				{
					item.parameters.forEach(function(item2)
					{



					});
					item.values.forEach(function(item2)
					{


					});

				}
				div.appendChild(btn);
				this.appendChild(div);

			});
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
						divPlot.appendChild(graphBlock);
						graphBlock.indexes=[item.x.index,item.y.index];
						if(item.z!==undefined){
							graphBlock.indexes.push(item.z.index);
							Plotly.newPlot(graphBlock,[{x:[],y:[],z:[],type:'scatter3d',maxdisplayed:10000}],{showlegend:true,title:item.description,xaxis:{title:item.x.description},yaxis:{title:item.y.description},zaxis:{title:item.z.description}});
						}else
						{
							Plotly.newPlot(graphBlock,[{x:[],y:[],type:'scatter',maxdisplayed:10000}],{showlegend:true,title:item.description,xaxis:{title:item.x.description},yaxis:{title:item.y.description}});
						}
						plots.push(graphBlock);
					});
					div.appendChild(divPlot);
					plotDivs=plots;
				}
				createPlot('taskBlock',taskModel.plot,taskModel.values,taskModel.argument);
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
					Plotly.restyle(item,{type:'scatter3d'});
				});
			}
			function drawPlot(data,index,methodName,methodColor)
			{
				index=Math.min(plotDivs[0].data.length);
				plotDivs.forEach(function(item)
				{
					if(item.indexes.length==3)
						Plotly.addTraces(item, {type:'scatter3d',marker:{color:methodColor,size:3},line:{color:methodColor,shape:'linear'},name:methodName,x:data[item.indexes[0]],y: data[item.indexes[1]],z:data[item.indexes[2]],mode: 'lines+markers'}, index);
					else
						Plotly.addTraces(item, {marker:{color:methodColor,size:3},line:{color:methodColor,shape:'linear'},name:methodName,x:data[item.indexes[0]],y: data[item.indexes[1]],mode: 'lines+markers'}, index);
				})
			}
		return {init:init,getTaskData:getTaskData,getOptions:getOptions,resetPlots:resetPlots,drawPlot:drawPlot};
	})();



	MethodPicker=(function()//done
	{
		var methodEditor;
		var methodCollection;
		var methods;
		var optionsGetters;
			function init(blockId,methodList)//map name:method
			{
				var block=document.getElementById(blockId);
				methodCollection=document.createElement('form');
				methodCollection.id='methodCollection';
				methodEditor=document.createElement('div');

				block.appendChild(methodCollection);
				methods=new Array();

				for(var key in methodList)
				{
					var m=methodList[key];
					methods.push({methodKey:key,method:m});
				}

				methodEditor=document.createElement('div');
				methodEditor.className="methodEditor";
				var divTable=document.createElement('div');
				divTable.style="display:table;border-spacing:5px;margin:auto";
				methodEditor.appendChild(divTable);
				var label=document.createElement('label');
				label.className='table_label';
				label.appendChild(document.createTextNode('Метод'));
				var table_row=document.createElement('div');
				table_row.className='table_row';
				divTable.appendChild(table_row);
				table_row.appendChild(label);
				var selectList=document.createElement('select');
				selectList.className='table_input method';

				table_row.appendChild(selectList);
				table_row=table_row.cloneNode(false);

				label=label.cloneNode(false);
				label.appendChild(document.createTextNode('Шаг, мс'));
				var input=document.createElement('input');
				input.className='table_input step';
				input.type='number';
				input.value='20';
				input.step='1';
				input.min='1';
				input.max='1000';
				table_row.appendChild(label);
				table_row.appendChild(input);
				divTable.appendChild(table_row);

				table_row=table_row.cloneNode(false);
				label=label.cloneNode(false);
				label.appendChild(document.createTextNode('Цвет'));
				input=document.createElement('input');
				input.className='table_input color';
				input.type='color';
				input.value="#0000FF";



				

				table_row.appendChild(label);
				table_row.appendChild(input);
				divTable.appendChild(table_row);

				table_row=table_row.cloneNode(false);

				label=label.cloneNode(false);
				label.appendChild(document.createTextNode('Пропуск точек'));
				var input=document.createElement('input');
				input.className='table_input drawStep';
				input.type='number';
				input.value='0';
				input.step='1';
				input.min='0';
				input.max='100';
				table_row.appendChild(label);
				table_row.appendChild(input);
				divTable.appendChild(table_row);


				var optionsBlocks={};
				var options=new Array();
				optionsGetters=new Array();
				var divOptions=document.createElement('div');
				divOptions.className='optionBlock autoStep';
				divOptions.setAttribute('disabled','');


				table_row=table_row.cloneNode(false);
				label=label.cloneNode(false);
				label.appendChild(document.createTextNode('Минимальный шаг, мс'));
				label.className='table_label';
				input=document.createElement('input');
				input.className='table_input minStep';
				input.type='number';
				input.value='20';
				input.step='5';
				input.min='5';
				input.max='1000';
				table_row.appendChild(label);
				table_row.appendChild(input);
				divOptions.appendChild(table_row);

				table_row=table_row.cloneNode(false);
				label=label.cloneNode(false);
				label.appendChild(document.createTextNode('Максимальный шаг, мс'));
				label.className='table_label';
				input=document.createElement('input');
				input.className='table_input maxStep';
				input.type='number';
				input.value='20';
				input.step='5';
				input.min='5';
				input.max='1000';
				table_row.appendChild(label);
				table_row.appendChild(input);
				divOptions.appendChild(table_row);

				table_row=table_row.cloneNode(false);
				label=label.cloneNode(false);
				label.appendChild(document.createTextNode('Допустимая ошибка'));
				label.className='table_label';
				input=document.createElement('input');
				input.className='table_input errorTolerance';
				input.type='number';
				input.value='0.001';
				input.step='any';
				input.min='0.0001';
				table_row.appendChild(label);
				table_row.appendChild(input);
				divOptions.appendChild(table_row);

				options.push(divOptions);
				optionsBlocks.autoStep=options.length-1;
				optionsGetters.push(function(block)
					{
						var data={};
						data.minStep=parseFloat(block.getElementsByClassName('minStep')[0].value)*0.001;
						data.maxStep=parseFloat(block.getElementsByClassName('maxStep')[0].value)*0.001;
						data.errorTolerance=parseFloat(block.getElementsByClassName('errorTolerance')[0].value);
						return data;
					});
				methodEditor.appendChild(divOptions);

				divOptions=document.createElement('div');
				divOptions.className='optionBlock useJacobian';
				divOptions.setAttribute('disabled','');


				table_row=table_row.cloneNode(false);
				label=label.cloneNode(false);
				label.appendChild(document.createTextNode('Расчёт матрицы Якоби'));
				label.className='table_label';
				input=document.createElement('select');
				input.className='table_input jacobianCalc';
				var option=document.createElement('option');
				option.value='0';
				option.appendChild(document.createTextNode('Численный'));
				input.appendChild(option);
				option=document.createElement('option');
				option.value='1';
				option.appendChild(document.createTextNode('Аналитический'));
				input.appendChild(option);
				table_row.appendChild(label);
				table_row.appendChild(input);




				divOptions.appendChild(table_row);
				table_row=table_row.cloneNode(false);
				label=label.cloneNode(false);
				label.appendChild(document.createTextNode('Константная матрица Якоби'));
				label.className='table_label';
				input=document.createElement('input');
				input.checked=false;
				input.type='checkbox';
				input.className='jacobianConst table_input';


				table_row.appendChild(label);
				table_row.appendChild(input);
				divOptions.appendChild(table_row);

				options.push(divOptions);
				optionsBlocks.useJacobian=options.length-1;
				optionsGetters.push(function(block)
					{
						var data={};
						data.jacobianCalc=block.getElementsByClassName('jacobianCalc')[0].value;
						data.jacobianConst=block.getElementsByClassName('jacobianConst')[0].checked;
						return data;
					});


				methodEditor.appendChild(divOptions);

				//selectList.optionsBlocks=optionsBlocks;


				methods.forEach(function(item,i)
				{
					var option=document.createElement('option');
					option.value=i;
					option.appendChild(document.createTextNode(item.method.attributes.name===undefined?'undefined':item.method.attributes.name));
					selectList.appendChild(option);

					var arr=new Array();
					if(item.method.hasOwnProperty('options')){
						item.method.options.forEach(function(item,i)
						{
							if(optionsBlocks.hasOwnProperty(item))
							{
								arr.push(optionsBlocks[item]);
							}
						});
					}
					methods[i].optionsBlocks=arr;
				});
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
				selectList.childNodes[0].setAttribute('selected','');

				var addButton=document.createElement('input');
				addButton.type="Button";
				addButton.value="Добавить метод";
				addButton.className="removeMethodButton";
				addButton.onclick=function()
				{
					var mE=methodEditor.cloneNode(true);
					var select=mE.getElementsByClassName('method')[0];
					select.optionsBlocks=mE.getElementsByClassName('optionBlock');
					select.onchange=function(e)
					{ 
						var self=this;
						for(var k=0;k<this.optionsBlocks.length;k++)
						{
							this.optionsBlocks[k].setAttribute('disabled', '');
						}
						methods[e.target.value].optionsBlocks.forEach(function(item,i)
						{
							self.optionsBlocks[item].removeAttribute('disabled');
							//item.style.display="";
						});
					}

					var removeButton=document.createElement('input');
					removeButton.type="Button";
					removeButton.value="Удалить";
					removeButton.className="removeMethodButton";
					removeButton.block=mE;
					removeButton.onclick=function()
					{
						methodCollection.removeChild(this.block);
					}
					mE.appendChild(removeButton);
					methodCollection.appendChild(mE);
					//select.childNodes[0].setAttribute('selected','');
					select.dispatchEvent(new Event('change'));
				}
				block.appendChild(addButton);
			}
			function collectChoosenMethods()
			{
				if(!methodCollection.reportValidity())
					return [];
				var tempMethods=methodCollection.getElementsByClassName('methodEditor');
				if(tempMethods.length==0)
					return [];
				var choosenMethods=new Array(tempMethods.length);
					//Task.get
				for(var i=0;i<tempMethods.length;i++)
				{
					var item=tempMethods[i];
					var values;
					var select=item.getElementsByClassName('method')[0];
					var temp={
						method:methods[select.selectedIndex],
						step:parseFloat(item.getElementsByClassName('step')[0].value)*0.001,
						color:item.getElementsByClassName('color')[0].value,
						options:{},
						drawStep:parseInt(item.getElementsByClassName('drawStep')[0].value)
					};
					temp.method.optionsBlocks.forEach(function(item,i)
						{
							var data=optionsGetters[item](select.optionsBlocks[item]);
							for(var key in data)
							{
								temp['options'][key]=data[key];
							}
							//item.style.display="";
						})
						choosenMethods[i]=temp;
				}
				return choosenMethods;
			}
			return {init:init,collectChoosenMethods:collectChoosenMethods};
		})();


Main=(function()
{
	var startButton;
	var frameID;
	var timer;
	function start()
	{
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
		var solvers=MethodPicker.collectChoosenMethods();
		if(solvers.length==0)
			return;
		var data=Task.getTaskData();//var data={values:values,argument:argument,plot:taskModel.plot,argumentLength:argumentLength,parameters:parameters,functions:taskModel.getFunctions(parameters)};
			
		Task.resetPlots();
		var counter=solvers.length;


		startButton.value="Стоп";
		startButton.onclick=stop;
		mainWorker.start(data,solvers,function(data,solver,index){
			Task.drawPlot(data,index,solver.method.method.attributes.name,solver.color);
		},stop);
		return;
	}
	var tasks;
	var index;
	var maxIndex;
	var dataArray;
	var currentTask;
	var solvers;
	var count;
	var maxPoints=10000;
	var curPoints=1;
	var progressBar;
	function init()
	{
		progressBar=document.getElementById('progressBar');
		Task.init('taskBlock',taskModelGlobal);
		MethodPicker.init('methodBlock',Methods,Task.options);
		startButton=document.getElementById('startButton');
		startButton.onclick=start;
		startButton.value="Старт";
		//startButton.onclick=start;
		mainWorker.init(startButton,progressBar);
	}
	init();
	//var worker;
	function loop(timestamp)
	{
		var dt=timestamp-timer;
		if(/*dt>10.000*/true)
		{
				if(currentTask.t0<currentTask.t1&&curPoints<maxPoints)
				{
					currentTask.method.Step(currentTask.values,currentTask.t0,currentTask.step,currentTask.functions,currentTask.options);
					for(var i=0;i<count;i++)
					{	
						dataArray[i].push(currentTask.values[i]);
					}
					currentTask.t0+=currentTask.step;
					dataArray[count].push(currentTask.t0);
					curPoints+=count;
				}else
				{
					Task.drawPlot(dataArray,index,solvers[index].method.method.attributes.name,solvers[index].color);
					index++;
					if(index==maxIndex)
					{
						stop();
						return;
					}
					curPoints=1;
					dataArray=new Array(count+1);
					/*for(var k=0;k<=count;k++)
					{
						dataArray[k]=new Array();
					}*/
					currentTask=tasks[index];
					for(var k=0;k<count;k++)
					{	dataArray[k]=new Array();
						dataArray[k].push(currentTask.values[k]);
					}
					dataArray[count]=new Array();
					dataArray[count].push(currentTask.t0);
				}
				timer=timestamp;
		}
		frameID=requestAnimationFrame(loop);
	}
	function stop()
	{
		mainWorker.stop();
		startButton.value="Старт";
		startButton.onclick=start;
		return;

		//worker = undefined;
	}
	return {start:start,stop:stop};
})();
//rosenbrock methods
//https://github.com/littleredcomputer/odex-js
//https://github.com/drewmiley/des-js