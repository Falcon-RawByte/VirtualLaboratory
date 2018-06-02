function gaussSolve(matrix,y)
{
	var rang=y.length;
	var x=new Array(rang);
	let epsilon=0.001
	function index(i,j)
	{
		return i*rang + j;
	};
	var indexes = new Array(rang);
	for (var i = 0; i < rang; i++)
	{
		indexes[i] = i;
	}
	for (var l = 0; l < rang; l++)
	{
		var max = l;
		for (var i = l + 1; i < rang; i++)
		{
			if (Math.abs(matrix[index(indexes[i], l)])>Math.abs(matrix[index(indexes[max], l)]))
				max = i;
		}
		//нашёл максимальный элемент
		//переставляю строки
		if (max != l)
		{
			var temp = indexes[l];
			indexes[l] = indexes[max];
			indexes[max] = temp;
		}
		if (Math.abs(matrix[index(indexes[l],l)]) < epsilon)
		{
			for(var i=0;i<rang;i++)
				x[i]=0.0;
			return x;
		}
		for (var i = l + 1; i < rang; i++)
			matrix[index(indexes[l], i)] = matrix[index(indexes[l],i)] / matrix[index(indexes[l],l)];
		y[indexes[l]] = y[indexes[l]] / matrix[index(indexes[l],l)];
		matrix[index(indexes[l],l)] = 1;

		for (var i = l + 1; i < rang; i++)
		{
			for (var k = l + 1; k < rang; k++)
				matrix[index(indexes[i],k)] = matrix[index(indexes[i],k)] - matrix[index(indexes[i],l)] * matrix[index(indexes[l],k)];
			y[indexes[i]] = y[indexes[i]] - matrix[index(indexes[i],l)] * y[indexes[l]];
			matrix[index(indexes[i],l)] = 0;
		}
	}
	x[rang - 1] = y[indexes[rang - 1]];
	for (var i = rang - 2; i > -1; i--)
	{
		var k = 0.;
		for (var j = i + 1; j < rang; j++)
		{
			k = k + matrix[index(indexes[i],j)] * x[j];
		}
		x[i] = y[indexes[i]] - k;
	}
	return x;
}

export default gaussSolve;