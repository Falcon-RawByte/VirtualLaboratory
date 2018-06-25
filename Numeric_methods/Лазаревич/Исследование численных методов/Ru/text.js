const language={
ru:{
	method:'Метод',
	step:'Шаг',
	maxStep:'Максимальный шаг',
	errorTolerance:'Допустимая ошибка',
	methodOrder:'',
	jacobianMatrix:'',
	constMatrix:'',
	initialConditions:'',
	systemParameters:'',
	load:'',
	delete:'',
	help:'',
	
}
,
en:{
	method:'Method',
	step:'Step',
	maxStep:'Max step',
	errorTolerance:'Error Tolerance',



}
}

function getString(key,lang)
{
	let text=language[lang][key];
	if(text==undefined)
		return 'Undefined';
	return text;
}