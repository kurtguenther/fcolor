var App = {
    currentIndex : 0,
    cachedData : [],
    container : null
};

App.start = function() {
	
	App.hideContainer();
	
	App.gridify(); 
	App.hideLoading(); 
	App.showContainer();
	
	if (App.testMode()) {
		var data = Test.generateData();
		App.loadFriends(data);
	}

};

App.toggleScale = function(div){
	if(div.parent().attr('data-scaled') == 'true')
	{
		App.scaleDown(div);
	}
	else
	{
		App.scaleUp(div);
	}
};

App.scaleDown = function(div){
	div.parent().animate({height:100},100);
	div.parent().animate({width:100},100);
	div.parent().find('img').animate({width:100},100);
	div.parent().find('img').animate({height:100},100);
	div.parent().find('.tile').css('margin-top', 'auto');
	div.parent().removeAttr('data-scaled');

	setTimeout(function(){
		App.container.isotope('reLayout', function(){});	
	}, 500);
};

App.scaleUp = function(div){
	div.parent().animate({height:308},100);
	div.parent().animate({width:308},100);
	
	var profileId = div.parent().find('img').attr('data-profile-id');
	var src = 'http://graph.facebook.com/' + profileId + '/picture?width=300&height=300';
	var img = div.parent().find('img');
	img.unbind('load');
	img.attr('src', src);
	
	div.parent().find('img').animate({width:308},100);
	div.parent().find('img').animate({height:308},100);
	
	div.parent().find('.tile').css('margin-top', '-208px');
	div.parent().attr('data-scaled','true');
	
	setTimeout(function(){
		App.container.isotope('reLayout', function(){});	
	}, 500);
};

App.loadMore = function(data)
{
    App.loadFriends(App.cachedData);
}

App.loadFriends = function(data) {
	var PAGE_LIMIT = 48;
	var count = data.length;
	var page = Math.min(count, PAGE_LIMIT);
	
	//Todo: check to see if the currentIndex is < the data size (so we don't run off the edge)
	page = Math.min(page, data.length - App.currentIndex); //I think this works, but never ran off the edge

	var container = $('#container');
	for (var i = 0 + App.currentIndex; i < page + App.currentIndex; i++) {
		var profile_id = data[i]['id'];

		if (profile_id && profile_id != '') {
			var img = $('<img class="profile-image facebook-image"/>');
			img.attr('data-name', data[i].name);
			img.attr('data-image-url', data[i].data_img_url);
			img.attr('data-profile-id', profile_id);
			
			img.load(function(img){
				
			 	//console.log(this);
					
				rgb = Util.getAverageRGB($(this)[0]);
				
				var hsl = Util.rgbToHsl(rgb.r, rgb.g, rgb.b);
				
				var hex = Util.rgbToHex(rgb.r, rgb.g, rgb.b);
				var name = Util.colorName(hex);
								
				//console.log(rgb);
		
				d = $('<div></div>');
				d.addClass('tile'); 
				d.css('background-color','rgb(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ')');
				
				pn = $('<div></div>');
				pn.addClass('profile-name');
				pn.text($(this).attr('data-name'));
				
				cn = $('<div></div>')
				cn.addClass('color-name');
				cn.text(name);
                
                		d.append(pn);
                		d.append(cn);
			
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
				
				photo.click(function(){
					App.toggleScale($(this));
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
					
				$(this)
					.parent()
					.attr('data-h', hsl.h);

				$(this)
					.parent()
					.attr('data-s', hsl.s);

				$(this)
					.parent()
					.attr('data-l', hsl.l);
					

    				//updated the sort on this
                		$('#container').isotope('updateSortData', $('#container').find('.item'));
			});
			
			var div = $('<div class="item"></div>');

			div.append(img);

           	    	var proxy_src = '/get/img/?img_url=' + escape('http://graph.facebook.com/' + profile_id + '/picture?width=100&height=100')
			img.attr('src', proxy_src);

			container.append(div);

            if(App.currentIndex > -1)
            {
    			// cfriel - can do this to asynchronously add items to isotope
    			// might run into race conditions	
                var $newItems = div;
    			$('#container').isotope('insert', $newItems);
    			//console.log('calling insert');
            }

		} else {
			//console.log('skipping user:' + data[i])
		}
	}
	
	App.currentIndex += page;
	
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
	
	App.container = $container;

	$container
		.isotope({
		itemSelector: '.item',
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
			},
			hue: function($elem) {
				h = parseFloat($elem.attr('data-h'));
				return h;
			},
			sat: function($elem) {
				s = parseFloat($elem.attr('data-s'));
				return s;
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
