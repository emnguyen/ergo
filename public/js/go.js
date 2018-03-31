/*
 * File: go.js
 * Description: Javascript for the Go page.
 */

/* Global variables */
var startTime;
var timer;
var currTime;

var stretchPlayer;
var currStretchTime;
var $currStretch;

/* Name: saveBookmark
 * Description: Show save bookmark modal.
 * Parameters: None
 * Return: None
 */
function saveBookmark() {
	// Return if already bookmarked
	if (localStorage.getItem("bookmark"))
		return;

	$('#save-bookmark').modal('show');
}

/* Name: submitBookmark
 * Description: Use POST to save a new bookmark to data.json.
 * Parameters: None
 * Return: None
 */
function submitBookmark() {
	var name = $('#bookmark-name').val();

	// Check that inputed name is nonempty
	if (name) {
		// Retrieve url params + fill out fields
		var queryString = location.href.split(location.host)[1];
		$('.bookmark-name').val(name);
		$('.bookmark-url').val(queryString);
		// Send form
	    $.post('/save-bookmark', $('#bookmark-form').serialize(), function(data) {
	   	});  
	    // Update bookmark icon
	    localStorage.setItem("bookmark", name);
		$('#routine-name').text(name);
	   	$('#bookmark-form').addClass('bookmarked');
	   	// Hide modal
		$('#save-bookmark').modal('hide');
   }
}

/* Name: getSystemTime
 * Description: Get system time and convert to seconds.
 * Parameters: None
 * Return: System time in seconds.
 */
function getSystemTime() {
	var time = new Date();
	return time/1000;
}

/* Name: startTimer
 * Description: Start timer from 0 and change status to active.
 * Parameters: None
 * Return: None
 */
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

/* Name: runTimer
 * Description: Runs every second inside setInterval. Decrements timer and
 * 		plays stretches once it hits 0.
 * Parameters: None
 * Return: None
 */
function runTimer() {
	// Play stretches once 0 is reached
	if (currTime <= 0) {
		clearInterval(timer);
		playStretches();
		return;
	}
	// Decrement and display time
	currTime -= 1;
	displayTime(currTime);
}

/* Name: displayTime
 * Description: Convert time from seconds to a string and display.
 * Parameters: s - time in seconds.
 * Return: None
 */
function displayTime(s) {
	$('.timer').text(sToTime(s));
}

/* Name: getTime
 * Description: Retrieve and return the current time.
 * Parameters: None
 * Return: Return the current time as a string.
 */
function getTime() {
	return $('.timer').text();
}

/* Name: resumeTimer
 * Description: Resumes timer from where it left off and updates status
 *		to active.
 * Parameters: None
 * Return: None
 */
function resumeTimer() {
	changeStatus("active");
	$('#resume-button').hide();
	$('#pause-button').show();

	if (currTime <= 0) 
		stretchPlayer = setInterval(runStretchPlayer, 1000);
	else
		timer = setInterval(runTimer, 1000);
}

/* Name: pauseTimer
 * Description: Pauses timer using clearInterval and updates status to paused.
 * Parameters: None
 * Return: None
 */
function pauseTimer() {
	changeStatus("paused");
	$('#pause-button').hide();
	$('#resume-button').show();

	clearInterval(timer);
	clearInterval(stretchPlayer);
}

/* Name: stopTimer
 * Description: Stops timer, sets status to stop, reset time fields.
 * Parameters: None
 * Return: None
 */
function stopTimer() {
	changeStatus("stop");
	// Reset controls
	$('#stop-button').hide();
	$('.pause-panel').hide();
	$('#start-button').show();
	$('#resume-button').hide();
	$('#pause-button').show();
	$('.gif-panel').slideUp();
	// Reset stretch player
	$($currStretch).removeClass('active');
	clearInterval(timer);
	clearInterval(stretchPlayer);
	currTime = 0;
	stretchTime = 0;
	displayTime(localStorage.getItem("interval"));
}

/* Name: getStretchTime
 * Description: Retrieve stretch timer and convert to seconds.
 * Parameters: None
 * Return: Returns the time in seconds.
 */
function getStretchTime() {
	var durationStr = $($currStretch).find('.stretch-timer').text();
	return parseDuration(durationStr);
}

/* Name: displayStretchTime
 * Description: Convert inputed stretch time to a string and display it.
 * Parameters: s - stretch time in seconds.
 * Return: None
 */
function displayStretchTime(s) {
	$($currStretch).find('.stretch-timer').text(sToTime(s));
}

/* Name: getStretchDuration
 * Description: Retrieves duration of the current stretch and converts
 		it to seconds.
 * Parameters: None
 * Return: Returns the duration of the current stretch in seconds.
 */
function getStretchDuration() {
	var durationStr = $($currStretch).find('.stretch-duration').text();
	return parseDuration(durationStr);
}

/* Name: updateDuration
 * Description: Update stretch duration/timer when a new stretch plays.
 * Parameters: None
 * Return: None
 */
function updateDuration() {
	var duration = getStretchDuration();
	displayStretchTime(duration);
	currStretchTime = duration;
}

/* Name: playStretches
 * Description: Start playing stretches by calling setInterval.
 * Parameters: None
 * Return: None
 */
function playStretches() {
	// Where SMS notification would be triggered
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

/* Name: offsetKey
 * Description: +1 to key so that they display starting from 1.
 * Parameters: None
 * Return: None
 */
function offsetKey() {
	var $key = $currStretch.find($('.key'));
	var $keyStore = $currStretch.find($('.key-store'));
	var i = parseInt($keyStore.text());
	$key.text(++i);
}

/* Name: runStretchPlayer
 * Description: Play stretch gifs until routine is finished.
 * Parameters: None
 * Return: None
 */
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

/* Name: stretching
 * Description: Indicate stretch time by hiding work message.
 * Parameters: None
 * Return: None
 */
function stretching() {
	$('.working-message').hide();
}

/* Name: working
 * Description: Indicate work time by showing work message.
 * Parameters: None
 * Return: None
 */
function working() {
	$('.working-message').show();
}

/* Name: changeStatus
 * Description: Change status dot to active/blue, paused/yellow, or stop.
 * Parameters: status - either "active", "paused", or "stop".
 * Return: None
 */
function changeStatus(status) {
	if (status == "active") {
		$("#routine-name").addClass('active');
		$("#routine-name").removeClass('paused');
	}
	else if (status == "paused") {
		$("#routine-name").removeClass('active');
		$("#routine-name").addClass('paused');
	}
	else if (status == "stop") {
		$("#routine-name").removeClass('active');
		$("#routine-name").removeClass('paused');
	}
}

/* Name: toggleShare
 * Description: Toggle sliding of the share url drawer.
 * Parameters: None
 * Return: None
 */
function toggleShare() {
	$('.share-drawer').slideToggle();
}

/* Name: toggleRoutine
 * Description: Toggle sliding of the stretch routine drawer.
 * Parameters: None
 * Return: None
 */
function toggleRoutine($drawerTitle) {
	$('.info-drawer').slideToggle();
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
	
	// Save bookmark
	$('#bookmark-form-submit').click(function() {
		saveBookmark();
	});

	// If loading a bookmark, set the page title as the bookmark name
	var bookmarkName;
	if (bookmarkName = localStorage.getItem("bookmark")) {
		$('#routine-name').text(bookmarkName);
		$('#bookmark-form').addClass('bookmarked');

		// Hide back button and status bar if showing bookmark
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

	// Controls
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