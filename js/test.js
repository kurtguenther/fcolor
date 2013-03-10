var Test = {};

Test.init = function(){
	Test.data = generateData();
};

Test.generateData = function(){
	
	var data=[];
	
	for(i=0; i <=53; i++)
	{
		var item = {
			id : i,
			name : "Test User " + i,
			src : "images/medium/" + (i+1) + ".jpg",
			data_img_url : "images/medium/" + (i+1) + ".jpg"
		};
		
		data.push(item);
	}
	
	return data;
};

