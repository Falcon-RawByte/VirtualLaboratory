



taskModelGlobal=(function()
			{
				var parameters=[{name:'sigma',description:'Параметр \u03C3',default:1,step:'0.01'},{name:'r',description:'Параметр r',default:1,step:'0.01'},{name:'b',description:'Параметр b',default:1,step:'0.01'}];
				var values=[{name:'x',description:'Координата x',default:1},{name:"y'",description:'Координата y',default:0},{name:'z',description:'Координата z',default:0}];
				var argument=[{name:'t',description:'Начальное время',default:0},{name:'dt',description:'Продолжительность',default:10,min:0}];
				
				var plot=[{x:{index:0,description:'X'},y:{index:1,description:'Y'},z:{index:2,description:'Z'},description:'Траектория частицы'}];
				var taskInfo={name:'Осциллятор Ван-дер-Поля',description:'Здесь должно быть описание задачи'};
				function getFunctions(parameters)
				{
					var functions=new Array(3);
					functions[0]=function(x,t)
					{
						var sigma=parameters[0];
						var b=parameters[2];
						var r=parameters[1];

						return sigma*(x[1]-x[0]);
					};
					functions[1]=function(x,t)
					{
						var sigma=parameters[0];
						var b=parameters[2];
						var r=parameters[1];

						return x[0]*(r-x[2])-x[1];
					};
					functions[2]=function(x,t)
					{
						var sigma=parameters[0];
						var b=parameters[2];
						var r=parameters[1];


						return x[0]*x[1]-b*x[2];
					}
					return functions;
				}
				function getJacobian(parameters)
				{
					var jacobian=
					[
						
					];
					return undefined;
					return jacobian;
				};
					return {parameters:parameters,values:values,argument:argument,plot:plot,getFunctions:getFunctions};
				})();