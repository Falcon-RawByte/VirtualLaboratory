import React from "react";
import $ from 'jquery';

var steps=[
{
	apply:function()
	{
		$('#sessionBlock').removeClass('showFocused');
		$('#taskBlockLabel')[0].scrollIntoView({
		  behavior:"smooth",
		  block:"start"
		});
		$('#taskBlockLabel').addClass('showFocused');
		$('#taskList').addClass('showFocused');
		//move to element
		//change element style

	},
	restore:function()
	{
		$('#taskDescriptionLabel').removeClass('showFocused');
		$('#taskDescription').removeClass('showFocused');
		$('#taskBlockLabel')[0].scrollIntoView({
		  behavior:"smooth",
		  block:"start"
		});
		$('#taskBlockLabel').addClass('showFocused');
		$('#taskList').addClass('showFocused');
		//rechangeelement style

	},
	description:(<div className="helpDescriptionContent">
		<div className="componentLabel helpDescriptionLabel">Выбор задачи</div>
		<div>В блоке Выбор задачи представлен список различных систем ОДУ, которые можно использовать для сравнения методов.</div>
		</div>)
},
{
	apply:function()
	{

		$('#taskBlockLabel').removeClass('showFocused');
		$('#taskList').removeClass('showFocused');
		$('#taskDescriptionLabel')[0].scrollIntoView({
		  behavior:"smooth",
		  block:"start"
		});
		$('#taskDescriptionLabel').addClass('showFocused');
		$('#taskDescription').addClass('showFocused');
		//move to element
		//change element style

	},
	restore:function()
	{
		$('#taskParametersBlock').removeClass('showFocused');
		$('#taskDescriptionLabel')[0].scrollIntoView({
		  behavior:"smooth",
		  block:"start"
		});
		$('#taskDescriptionLabel').addClass('showFocused');
		$('#taskDescription').addClass('showFocused');
		//rechangeelement style

	},
	description:(<div className="helpDescriptionContent">
		<div className="componentLabel helpDescriptionLabel">Описание задачи</div>
		<div>В блоке "Описание задачи" представлено описание текущей выбранной задачи.</div>
		<div>Размеры блока можно менять, потянув мышью в правом нижнем углу.</div>
		</div>)
},
{
	apply:function()
	{
		$('#taskDescriptionLabel').removeClass('showFocused');
		$('#taskDescription').removeClass('showFocused');
		$('#taskParameters')[0].scrollIntoView({
		  behavior:"smooth",
		  block:"start"
		});
		$('#taskParametersBlock').addClass('showFocused');
		//move to element
		//change element style

	},
	restore:function()
	{
		$('#taskParameters')[0].scrollIntoView({
		  behavior:"smooth",
		  block:"start"
		});
		//rechangeelement style

	},
	description:(<div className="helpDescriptionContent">
		<div className="componentLabel helpDescriptionLabel">Параметры системы</div>
		<div>Блок "Параметры системы"" позволяет задавать значения численных констант для выбранной задачи. </div>
		</div>)
},
{
	apply:function()
	{
		$('#taskInitials')[0].scrollIntoView({
		  behavior:"smooth",
		  block:"start"
		});

		//move to element
		//change element style

	},
	restore:function()
	{
		$('#methodsBlockLabel').removeClass('showFocused');
		$('#methodsList').removeClass('showFocused');
		$('#taskInitials')[0].scrollIntoView({
		  behavior:"smooth",
		  block:"start"
		});
		$('#taskParametersBlock').addClass('showFocused');
		//rechangeelement style

	},
	description:(<div className="helpDescriptionContent">
		<div className="componentLabel helpDescriptionLabel">Начальные условия и интервал расчёта</div>
		<div>В блоке "Начальные условия и интервал расчёта" расположены элементы для задания значений в момент времени t<sub>0</sub>.</div>
		<div>Элементы "Начальное время" и "Продолжительность" задают значение t<sub>0</sub> и длину интервала расчёта решений.</div>
		</div>)
},
{
	apply:function()
	{
		$('#taskParametersBlock').removeClass('showFocused');
		$('#methodsBlockLabel')[0].scrollIntoView({
		  behavior:"smooth",
		  block:"start"
		});
		$('#methodsBlockLabel').addClass('showFocused');
		$('#methodsList').addClass('showFocused');
		//move to element
		//change element style

	},
	restore:function()
	{
		$('#methodParameters').removeClass('showFocused');
		$('#methodsBlockLabel')[0].scrollIntoView({
		  behavior:"smooth",
		  block:"start"
		});
		$('#methodsBlockLabel').addClass('showFocused');
		$('#methodsList').addClass('showFocused');
		//mov

		//rechangeelement style

	},
	description:(<div className="helpDescriptionContent">
		<div className="componentLabel helpDescriptionLabel">Выбор методов</div>
		<div>Блок "Выбор методов" предназначен для задания параметров исследуемых методов.</div>
		<div>Нажатие на кнопку добавляет новый метод в список методов.</div>
		<div>При нажатии на элемент списка его параметры отображаются в правой части.</div>
		</div>) 
},
{
	apply:function()
	{
		$('#methodsBlockLabel')[0].scrollIntoView({
		  behavior:"smooth",
		  block:"start"
		});
		$('#methodParameters').addClass('showFocused');
		//move to element
		//change element style

	},
	restore:function()
	{
		$('#methodsBlockLabel')[0].scrollIntoView({
		  behavior:"smooth",
		  block:"start"
		});
		//mov
		//rechangeelement style

	},
	description:(<div className="helpDescriptionContent">
		<div className="componentLabel helpDescriptionLabel">Параметры методов</div>
		<div>"Метод" - позволяет выбрать метод из списка</div>
		<div>"Шаг" - задаёт минимальный шаг для решения, шаг отображается в 1/1000 секунды</div>
		<div>"Максимальный Шаг" - задаёт максимальный шаг для решения, актуален для методов с адаптивным размером шага</div>
		<div>"Допустимая ошибка" - задаёт величину допустимой локальной ошибки, которая используется для расчёта шага в методах с выбором шага</div>
		</div>) 
},
{
	apply:function()
	{
		$('#methodsBlockLabel')[0].scrollIntoView({
		  behavior:"smooth",
		  block:"start"
		});
		//move to element
		//change element style

	},
	restore:function()
	{
		$('#outputParametersBlock').removeClass('showFocused');
		$('#methodsBlockLabel')[0].scrollIntoView({
		  behavior:"smooth",
		  block:"start"
		});
		$('#methodParameters').addClass('showFocused');
		$('#methodsList').addClass('showFocused');
		$('#methodsBlockLabel').addClass('showFocused');
		//mov
		//rechangeelement style

	},
	description:(<div className="helpDescriptionContent">
		<div className="componentLabel helpDescriptionLabel">Параметры методов - продолжение</div>
		<div>"Порядок метода" - задаёт порядок используемого метода, актуально для многошаговых методов.</div>
		<div>"Матрица Якоби" - задаёт способ расчёта значений матрицы Якоби для неявных методов. Возможные значения - Приближённая, Аналитическая</div>
		<div>"Константная матрица" - задаёт способ использования матрицы Якоби для итераций метода Ньютона. При положительном значении матрица рассчитывается только один раз перед итерациями на шаге.</div>
		</div>) 
},
{
	apply:function()
	{
		$('#methodsList').removeClass('showFocused');
		$('#methodParameters').removeClass('showFocused');
		$('#methodsBlockLabel').removeClass('showFocused');
		$('#outputFooter').css({height:'400px',width:'100%'});
		$('#outputParametersLabel')[0].scrollIntoView({
		  behavior:"smooth",
		  block:"start"
		});
		$('#outputParametersBlock').addClass('showFocused');

		//move to element
		//change element style

	},
	restore:function()
	{
		$('#outputCalculateButton').removeClass('showFocused');
		$('#outputParametersLabel')[0].scrollIntoView({
		  behavior:"smooth",
		  block:"start"
		});
		$('#outputParametersBlock').addClass('showFocused');
		//rechangeelement style

	},
	description:(<div className="helpDescriptionContent">
		<div className="componentLabel helpDescriptionLabel">Параметры выходных данных</div>
		<div>В блоке "Параметры выходных данных"" возможен выбор эталонного решения для расчёта относительно него локальной и глобальной ошибки остальных методов.</div>
		<div>Помимо этого в данном блоке указываются графики, которые будут отображены в результатах расчёта решений.</div>
		<div>Для кажой задачи имеются специфичные графики.</div>
		<div>В блоке "Интервал построения графиков задаётся временной интервал, точки которого будут отображены на выбранных графиках.(В целях экономии памяти)</div>
		</div>) 
},
{
	apply:function()
	{
		$('#outputParametersBlock').removeClass('showFocused');
		$('#outputCalculateButton')[0].scrollIntoView({
		  behavior:"smooth",
		  block:"start"
		});
		$('#outputCalculateButton').addClass('showFocused');
		//move to element
		//change element style

	},
	restore:function()
	{
		$('#sessionBlock').removeClass('showFocused');
		$('#outputFooter').css({height:'400px',width:'100%'});
		$('#outputCalculateButton')[0].scrollIntoView({
		  behavior:"smooth",
		  block:"start"
		});
		$('#outputCalculateButton').addClass('showFocused');
		//rechangeelement style

	},
	description:(<div className="helpDescriptionContent">
		<div className="componentLabel helpDescriptionLabel">Расчёт</div>
		<div>Кнопка "Расчёт" запускает(что бы вы думали?) расчёт решений с использованием заданных методов.</div>
		<div>После расчёта, в нижней части появляются блоки "Вывод Результатов" и "Графики".</div>
		<div>В блоке "Вывод результатов" представлены следующие данные по каждому решению:</div>
			<ul>
				<li>Количество вычислений</li>
				<li>Средний шаг метода при решении</li>
				<li>Величина ошибки</li>
				<li>Количество решений системы уравнений</li>
			</ul>
		</div>) 
},
{
	apply:function()
	{
		$('#outputCalculateButton').removeClass('showFocused');
		$('#sessionBlockLabel')[0].scrollIntoView({
		  behavior:"smooth",
		  block:"start"
		});
		$('#sessionBlock').addClass('showFocused');
		setTimeout(() => {
			$('#outputFooter').css({height:'0px',width:'0px'});
        	}, 400);
		//move to element
		//change element style

	},
	restore:function()
	{
		$('#sessionBlockLabel')[0].scrollIntoView({
		  behavior:"smooth",
		  block:"start"
		});
		//rechangeelement style

	},
	description:(<div className="helpDescriptionContent">
		<div className="componentLabel helpDescriptionLabel">Сохранение параметров</div>
		<div>Блок Наборы параметров эксперимента предназначен для сохранения и загрузки наборов параметров.</div>
		<div>Наборы параметров создаются отдельно для каждой задачи и хранятся до момента завершения работы со стендом. </div>
		<div>Для возможности работы с наборами при новом запуске стенда предусмотрена возможность сохранения и загрузки списка наборов в файл. </div>
		</div>)
},
{
	apply:function()
	{
		$('#sessionBlockLabel')[0].scrollIntoView({
		  behavior:"smooth",
		  block:"start"
		});
		//move to element
		//change element style

	},
	restore:function()
	{
		$('#sessionBlockLabel')[0].scrollIntoView({
		  behavior:"smooth",
		  block:"start"
		});
		//rechangeelement style

	},
	description:(<div className="helpDescriptionContent">
		<div className="componentLabel helpDescriptionLabel">Сохранение параметров - продолжение</div>
		<div>Возможные действия:</div>
		<ul>
			<li>Добавить набор параметров – сохранение заданных параметров задачи, списка методов и параметров выходных данных.</li>
			<li>Создать новый набор – сброс всех текущих заданных параметров задачи, списка методов и параметров выходных данных</li>
			<li>Загрузить из файла – выбор файла для загрузки списка наборов</li>
			<li>Сохранить в файл – сохранения файла на локальном диске</li>
			<li>Загрузить – применение сохранённые в наборе значения параметров</li>
			<li>Удалить – удаление заданного набора из списка </li>
		</ul>
		</div>)
}
];


class Help extends React.Component
{
	constructor(props)
	{
		super(props);
		this.state={step:0};
		this._moveForward=this._moveForward.bind(this);
		this._moveBackward=this._moveBackward.bind(this);
		this.maxStep=steps.length;
		
	}
	_moveForward()
	{
		let prevStep=this.state.step;
		let step=(this.state.step+1)%(this.maxStep+1);
		if(step>0)
			steps[step-1].apply();
		this.setState({step:step});
	}
	_moveBackward()
	{
		let step=(this.state.step-1);
		steps[step-1].restore();
		this.setState({step:step});
	}
	render(){
		let className='m-fadeIn';
		if(this.state.step==0)
		{
			className='m-fadeOut';
		}
		let description;
		if(this.state.step!=0)
		{
			description=(<div id="helpDescription">
							{steps[this.state.step-1].description}
							</div>);
		}
		let rightMark=this.state.step==this.maxStep?(<svg className="helpChangeIcon" xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8">
						  <use href="#check"></use>
						  </svg>):(<svg className="helpChangeIcon" xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8">
						  <use href="#arrow-right"></use>
						  </svg>);
		return (<div id="help">
					<div id="helpIcon" onClick={this._moveForward} className={this.state.step==0?'m-fadeIn':'m-fadeOut'}>
						<svg id="svgHelpIcon" xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8">
						  <use href="#question-mark"></use>
						  </svg>
					</div>
					<div id="helpBlock" className={className}>
						<div id="helpBackground">
						</div>
						<div className={'hideable'+(this.state.step!=0?' showModal':'')} id="helpContent">
							<div id="helpContentBackground">
							</div>
							<div id="helpPrevios" onClick={this._moveBackward} style={this.state.step==1?{visibility:'hidden'}:{}}>
							<svg className="helpChangeIcon" xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8">
							  <use href="#arrow-left"></use>
							  </svg>
							</div>
							{description}
							<div id="helpNext" onClick={this._moveForward}>
							{rightMark}
							</div>
						</div>
					</div>
				</div>
			);
	}
}

module.exports=Help;