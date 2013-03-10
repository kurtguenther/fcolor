var App = {};

App.start = function() {
	
	App.hideContainer();

	if (App.testMode()) {
		var data = Test.generateData();
		App.loadFriends(data);
	}
	
	setTimeout(function(){
		App.gridify(); 
		App.hideLoading(); 
		App.showContainer();
	}, 2000);

};

App.loadFriends = function(data) {
	var PAGE_LIMIT = 32;
	var count = data.length;
	var page = Math.min(count, PAGE_LIMIT);

	var container = $('#container');
	for (var i = 0; i < page; i++) {
		var profile_id = data[i]['id'];

		if (profile_id && profile_id != '') {
			var img = $('<img class="profile-image facebook-image"/>');
			img.attr('data-name', data[i].name);
			img.attr('data-image-url', data[i].data_img_url);
			img.attr('src', data[i].src);

			var div = $('<div class="item"></div>');

			div.append(img);

			container.append(div);
		} else {
			console.log('skipping user:' + data[i])
		}
	}
};

App.hideContainer = function(){
	$('#container').css('visibility', 'hidden');	
};

App.showContainer = function(){
	$('#container').css('visibility', 'visible');	
};

App.showLoading = function(){
	$('#loading').show();
};

App.hideLoading = function(){
	$('#loading').hide();	
};

App.testMode = function() {
	var testMode = Util.getParameterByName('testMode');
	return testMode != "";
};

App.useFacebook = function() {
	return !App.testMode();
};

App.gridify = function() {

	var $container = $('#container');

	$('.profile-image.facebook-image')
		.each(function() {
		rgb = Util.getAverageRGB($(this)[0]);
		console.log(rgb);
		
		d = '<div class="tile" style="width:100%; height: 100%; background-color:rgb(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ');"><span align="center" class="profile-name">' + $(this).attr('data-name') + '</span></div>';
			
		$(this)
			.parent()
			.append(d);

		var tile = $(this)
			.parent()
			.find('.tile');
			
		var photo = $(this)
			.parent()
			.find('.profile-image.facebook-image');

		tile.mouseover(function() {

			$('.tile')
				.show();

			$(this)
				.hide();

			photo.mouseout(function() {
				tile.show();
			});

		});

		$(this)
			.parent()
			.attr('data-r', rgb.r);
		$(this)
			.parent()
			.attr('data-g', rgb.g);
		$(this)
			.parent()
			.attr('data-b', rgb.b);

	});


	$container
		.isotope({
		itemSelector: '.item',
		layoutMode: 'fitRows',
		getSortData: {
			red: function($elem) {
				r = parseFloat($elem.attr('data-r'));
				g = parseFloat($elem.attr('data-g'));
				b = parseFloat($elem.attr('data-b'));
				return r / ((r + g + b) / 3.0);
			},
			green: function($elem) {
				r = parseFloat($elem.attr('data-r'));
				g = parseFloat($elem.attr('data-g'));
				b = parseFloat($elem.attr('data-b'));
				return g / ((r + g + b) / 3.0);
			},
			blue: function($elem) {
				r = parseFloat($elem.attr('data-r'));
				g = parseFloat($elem.attr('data-g'));
				b = parseFloat($elem.attr('data-b'));
				return b / ((r + g + b) / 3.0);
			}
		}
	});

	/* // cfriel - this shuffle thing, disable it for now setInterval(function() { $('.tile') .each(function(index, ui) { $(this) .delay(index * 100) .fadeIn(function() { //$(this).toggle(); }); }); }, 25000); */

	$('#sort-by a')
		.click(function() {
		var sortName = $(this)
			.attr('href')
			.slice(1);
		$container.isotope({
			sortBy: sortName
		});
		return false;
	});

};