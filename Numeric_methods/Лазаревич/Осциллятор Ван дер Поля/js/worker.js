//importScripts('solvers.js');




self.addEventListener('message', function(e) {

	console.info('start',e.data);
	importScripts(e.data);
	var t0=sendData.t0;
	var t1=sendData.t1;
	var step=sendData.step;
	var values=sendData.values;
	var count=values.length;
	var data=new Array(count+1);
	var method=sendData.method;
	var options=sendData.options;
	var functions=sendData.functions;
	console.info('start',step);
	for(var i=0;i<=count;i++)
		data[i]=new Array();
	while(t0<=t1)
	{
		method.Step(values,t0,step,functions,options);

		for(var i=0;i<count;i++)
			data[i].push(values[i]);
		data[count]=t0;
		t0+=step;
	}

	var message={data:data,index:sendData.index};
  	self.postMessage(message);
}, false);