/*
 * File: go.js
 * Description: Javascript for the Go page.
 */

function pulse(object) {
	$(object).fadeIn(600, function() {
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

	// Return if already bookmarked
	if (localStorage.getItem("fav"))
		return;

	var name = prompt("Name this routine:");
	if (name) {
		var queryString = location.href.split(location.host)[1];

		$('.fav-name').val(name);
		$('.fav-url').val(queryString);

	    $.post('/save-fav', $('#fav-form').serialize(), function(data) {
	   	});  

	    // Update bookmark icon
	    localStorage.setItem("fav", name);
		$('#routine-name').text(name);
	   	$('#fav-form').addClass('bookmarked');

	   //	pulse('#heart');
   }
}



/*
 * Main function
 */
var main = function () {
	$('#fav-form-submit').click(function() {
		saveFav();
	});

	// If loading a favorite, set the page title as the fav name
	var favName;
	if (favName = localStorage.getItem("fav")) {
		$('#routine-name').text(favName);
		$('#fav-form').addClass('bookmarked');

		// Hide back button and status bar if showing fav
		$('.back-button').hide();
		$('.progress-container').hide();
	}

	// Get go url
	var go = location.href.split(location.host)[1];
	// If new url, reset
	if (go != localStorage.getItem("go")) {
		resetGo();
		localStorage.setItem("go", go);
	}

	// Check status and show stop if active
	var status;
	if (status = localStorage.getItem("status")) {
		$('#start-button').hide();
		$('#stop-button').show();
		$('.pause-panel').show();
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

};
$(document).ready(main);