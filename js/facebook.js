var Facebook = {};

function safariHack()
{
	facebookInit();
}

$(document).ready(function(){
	if($.browser.safari)
	{
		setTimeout(safariHack, 1000);
	}
});

window.fbAsyncInit = function() {
	FB.init({
		appId: '277386932393277',
		status: true,
		cookie: true,
		xfbml: true
	});
	
	if (typeof facebookInit == 'function' && App.useFacebook()) {
	      	console.log('calling facebook init');
	            facebookInit();
	      	console.log('called facebook init');
		
	}
};

(function(d, debug) {
	var js, id = 'facebook-jssdk',
		ref = d.getElementsByTagName('script')[0];
	if (d.getElementById(id)) {
		return;
	}
	js = d.createElement('script');
	js.id = id;
	js.async = true;
	js.src = "//connect.facebook.net/en_US/all" + (debug ? "/debug" : "") + ".js";
	ref.parentNode.insertBefore(js, ref);
}(document, /*debug*/ false));

function facebookInit() {
	FB.login(function(response) {
		if (response.authResponse) {
			var access_token = FB.getAuthResponse()['accessToken'];

			//check that we're in.
			console.log('Access Token = ' + access_token);
			FB.api('/me', function(response) {
				console.log('Good to see you, ' + response.name + '.');
				console.log('We are in.');
			});

			FB.api('/me/friends', Facebook.processFriendApi);

		} else {
			console.log('User cancelled login or did not fully authorize.');
		}
	}, {
		scope: ''
	});
};

Facebook.processFriendApi = function(response)
{
    App.currentIndex = 0;
    App.cachedData = response.data;
    App.loadFriends(response.data);
}

Facebook.parseData = function(response) {
	var data = [];
	var PAGE_LIMIT = 32;
	var count = response.data.length;
	var page = Math.min(count, PAGE_LIMIT);

	var container = $('#container');
	for (var i = 0; i < page; i++) {
		var profile_id = response.data[i]['id'];

		if (profile_id && profile_id != '') {
			
			var item = {
				id : profile_id,
				name : response.data[i]['name'],
				src : '/get/img/?img_url=' + escape('http://graph.facebook.com/' + profile_id + '/picture?width=100&height=100'),
				data_img_url : 'http://graph.facebook.com/' + profile_id + '/picture?width=100&height=100'
			};
			
			data.push(item);
			
			
		} else {
			console.log('skipping user:' + response.data[i])
		}
	}
	
	return 
};
