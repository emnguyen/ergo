/*
 * File: go.js
 * Description: Javascript for the Go page.
 */

function pulse(object) {
	$(object).fadeIn(500, function() {
		$(this).effect( "bounce", {times: 2, distance: 25}, 300).fadeOut(400);
  });
}

/* Name: savFav
 * Description: Uses POST to save a routine as a favorite.
 * Parameters: None
 * Return None
 */
function saveFav() {
	// Get name and current url
	var name = prompt("Name this routine:");
	if (name) {
	var queryString = location.href.split(location.host)[1];

	$('.fav-name').val(name);
	$('.fav-url').val(queryString);

    $.post('/save-fav', $('#fav-form').serialize(), function(data) {
   	});  

   	pulse('#heart');
   }
}

function start() {
	$('#status-container').removeClass('pause');
	$('#status-container').slideDown();
	$('#start-button').hide();
	$('#stop-button').show();
	localStorage.setItem("status", "active");
}

function stop() {
	$('#status-container').slideUp();
	$('#start-button').show();
	$('#stop-button').hide();
	localStorage.removeItem("status");
}





/*
 * Main function
 */
var main = function () {
	$('#fav-form-submit').click(function() {
		saveFav();
	});

	// Save go url
	localStorage.setItem("go", location.href.split(location.host)[1]);

	// Check status and show stop if active
	var status;
	if (status = localStorage.getItem("status")) {
		$('#start-button').hide();
		$('#stop-button').show();
	}

	$('#start-button').click(function() {
		start();
	});
	$('#pause-button').click(function() {
		togglePause();
	});
	$('#stop-button').click(function() {
		stop();
	});

	// If loading a favorite, set the page title as the fav name
	var favName;
	if (favName = localStorage.getItem("fav")) {
		$('#routine-name').text(favName);
	}

	// Reset favorite flag upon leaving page
	window.onbeforeunload = function(){
  		localStorage.removeItem("fav");
	};


/*
	var isGuest = $.getJSON('user.json', function(user) {
		console.log(user["guest"]);
		return user["guest"];

	});

	// If guest, load phone from session storage
	if (isGuest) {
		
		// Check that guest has entered a phone
		if (!sessionStorage.getItem("guestPhone"))
			window.location.href = "/";
		else
			$('.active-phone').html(sessionStorage.getItem("guestPhone"));
		
	}
	else {
		$('.active-phone').html("logged in");
	}
	*/
};
$(document).ready(main);