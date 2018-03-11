


//здесь будет задание



taskModel=(function()
			{
				var parameters=[{name:'u',description:'Параметр \u03bc',default:20,step:'0.1'}];
				var values=[{name:'x',description:'Начальная позиция',default:1},{name:"x'",description:'Начальная скорость',default:0}];//x,x'
				var argument=[{name:'t',description:'Начальное время',default:0},{name:'dt',description:'Продолжительность',default:10,min:0}];
				//var plot=[{x:'t',y:'x'},{x:'x',y:"x'"}];
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
					return {parameters:parameters,values:values,argument:argument,plot:plot,getFunctions:getFunctions,getJacobian:getJacobian};
				})();