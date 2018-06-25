





let translation={
	ru:{

	},
	eng:
	{


	},
	getText:function(key,lang)
	{
		let text=this[lang][key];
		return text==undefined?'INVALID_LANG_KEY':text;
	}
}


export default translation;