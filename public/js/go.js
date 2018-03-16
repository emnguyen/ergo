/*
 * File: go.js
 * Description: Javascript for the Go page.
 */

var startTime;
var timer;
var currTime;

var stretchPlayer;
var currStretchTime;
var $currStretch;

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



function getSystemTime() {
	var time = new Date();
	return time/1000;
}

function startTimer() {
	changeStatus("active");

	$('#start-button').hide();
	$('#stop-button').show();
	$('.pause-panel').show();
	$('.gif-panel').slideDown();

	working();
	currTime = startTime;
	timer = setInterval(runTimer, 1000);
}

function runTimer() {
	// Play stretches once 0 is reached
	if (currTime <= 0) {
		clearInterval(timer);
		playStretches();
		return;
	}

	currTime -= 1;
	displayTime(currTime);
}

function displayTime(s) {
	$('.timer').text(sToTime(s));
}

function getTime() {
	return $('.timer').text();
}

function resumeTimer() {
	changeStatus("active");
	$('#resume-button').hide();
	$('#pause-button').show();

	if (currTime <= 0) 
		stretchPlayer = setInterval(runStretchPlayer, 1000);
	else
		timer = setInterval(runTimer, 1000);
}


function pauseTimer() {
	changeStatus("paused");
	$('#pause-button').hide();
	$('#resume-button').show();

	clearInterval(timer);
	clearInterval(stretchPlayer);
}

function stopTimer() {
	changeStatus("stop");
	$('#stop-button').hide();
	$('.pause-panel').hide();
	$('#start-button').show();
	$('#resume-button').hide();
	$('#pause-button').show();
	$('.gif-panel').slideUp();
	$($currStretch).removeClass('active');
	clearInterval(timer);
	clearInterval(stretchPlayer);
	currTime = 0;
	stretchTime = 0;
	displayTime(localStorage.getItem("interval"));
}


function getStretchTime() {
	var durationStr = $($currStretch).find('.stretch-timer').text();
	return parseDuration(durationStr);
}

function displayStretchTime(s) {
	$($currStretch).find('.stretch-timer').text(sToTime(s));
}

function getStretchDuration() {
	var durationStr = $($currStretch).find('.stretch-duration').text();
	return parseDuration(durationStr);
}

function updateDuration() {
	var duration = getStretchDuration();
	displayStretchTime(duration);
	currStretchTime = duration;
}

function playStretches() {
	//alert("Time to stretch!");
	stretching();
	// Get first stretch and make it active
	var $firstStretch = $('.curr-stretch').first();
	$currStretch = $firstStretch;

	$($currStretch).addClass('active');

	// Set duration
	updateDuration();
	stretchPlayer = setInterval(runStretchPlayer, 1000);
	offsetKey();
}

function offsetKey() {
	var $key = $currStretch.find($('.key'));
	var $keyStore = $currStretch.find($('.key-store'));
	var i = parseInt($keyStore.text());
	$key.text(++i);
}

function runStretchPlayer() {
	// Play next stretch once 0 is reached
	if (currStretchTime <= 0) {
		$($currStretch).removeClass('active');
		$nextStretch = $currStretch.next();

		// Return if end of stretches reached
		if ($nextStretch.length == 0) {
			clearInterval(stretchPlayer);
			currTime = localStorage.getItem("interval");
			displayTime(currTime);
			startTimer();
			working();
		}
		// Otherwise, update display with new stretch
		else {
			$currStretch = $nextStretch;
			$($currStretch).addClass('active');
			offsetKey();
			// Get new stretch duration
			updateDuration();
		}
	}

	currStretchTime -= 1;
	displayStretchTime(currStretchTime);
}

function stretching() {
	$('.working-message').hide();
}

function working() {
	$('.working-message').show();
}

function changeStatus(status) {
	if (status == "active") {
		$("#routine-name").addClass('active');
		$("#routine-name").removeClass('paused');
	}
	else if (status == "paused") {
		$("#routine-name").removeClass('active');
		$("#routine-name").addClass('paused');
	}
	else {
		$("#routine-name").removeClass('active');
		$("#routine-name").removeClass('paused');
	}
}

function toggleShare() {
	$('.share-drawer').slideToggle();
}

function toggleRoutine($drawerTitle) {
	$('.info-drawer').slideToggle();
	$($drawerTitle).text($($drawerTitle).text() == 'View Routine' ? 'Hide Routine' : 'View Routine');
}

/*
 * Main function
 */
var main = function () {

	// Get interval and save in local storage
	var interval = parseInt($('.interval').text());
	localStorage.setItem("interval", interval);

	startTime = interval;

	// Display time
	displayTime(interval);
	
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

	// Toggle routine drawer
	$('.more-info').click(function(e) {
		e.preventDefault();
		toggleRoutine(this);
	});
	$('.info-drawer .x-icon').click(function() {
		toggleRoutine($('.more-info'));
	});

	// Load share url
	$('#share-url').val(window.location.href);

	// Toggle share drawer
	$('.share').click(function() {
		toggleShare();
	});
	$('.share-drawer .x-icon').click(function() {
		toggleShare();
	});

	// Share/copy button
	$('.share-button').click(function() {
		var copyText = document.getElementById("share-url");
		copyText.select();
		document.execCommand("Copy");
		console.log("copied");

		// Show tooltip
		$(this).tooltip('show');
	});

	$('#start-button').click(function() {
		startTimer();
	});
	$('#pause-button').click(function() {
		pauseTimer();
	});
	$('#resume-button').click(function() {
		resumeTimer();
	});
	$('#stop-button').click(function() {
		stopTimer();
	});

};
$(document).ready(main);