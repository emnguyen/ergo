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
	currTime = startTime;
	/*
	timer = setInterval(function() {
		currTime -= 1;
    	displayTime(currTime);
    		
    	// Play stretches once 0 is reached
    	if (currTime == 0) {
    		clearInterval(timer);
    		playStretches();
    		return;
    	}

	}, 1000); */
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
	if (currTime <= 0) 
		stretchPlayer = setInterval(runStretchPlayer, 1000);
	else
		timer = setInterval(runTimer, 1000);
}


function pauseTimer() {
	clearInterval(timer);
	clearInterval(stretchPlayer);
}

function stopTimer() {
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
			//displayStretchTime(getStretchDuration());
			updateDuration();
		}
		
		
	}

	currStretchTime -= 1;
	displayStretchTime(currStretchTime);
}

/*
function startStretch($firstStretch) {
 	stretching();
	// Return if STOP
	//if (!localStorage.getItem("status"))
	//	return;
	$currStretch = $firstStretch;

	$($currStretch).addClass('active');

	// TEMP: 5 second intervals
	//var $seconds = getStretchTime();
	//var duration = parseInt($($seconds).text());


	stretchCounter = duration;


	stretchPlayer = setInterval(function() {
	    stretchCounter--;

	    // Prepend 0 if necessary
	    var num = stretchCounter;
	    if (stretchCounter < 10) {
	    	num = "0" + num;
	    }
	    $($seconds).text(num);

	    // When 0 is reached
	    if (stretchCounter == 0) {
	        clearInterval(stretchPlayer);
	        // Reset duration
	        $($seconds).text(duration);

        	// Get next stretch
			var $nextStretch = $($currStretch).next();
			// Set new duration


			// Return if end reached
			if ($nextStretch.length == 0) {
				$($currStretch).removeClass('active');
				clearInterval(stretchPlayer);
				working();
				startTimer();
				return;
				//$nextStretch = $('.curr-stretch').first();
			}

			$($currStretch).removeClass('active');
			
			return startStretch($nextStretch);
	    }
	}, 1000);	
}
*/


function stretching() {
	//$('.gif-panel').slideDown();
	$('.working-message').hide();
}

function working() {
	$('.working-message').show();
	//$('.gif-panel').slideUp();
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

	// Check status and show stop if active
	/*
	var status;
	if (status = localStorage.getItem("status")) {
		$('#start-button').hide();
		$('#stop-button').show();
		$('.pause-panel').show();
	}

	$('#start-button').click(function() {
		startTimer();
		start();


	});
	$('#pause-button').click(function() {

		pauseTimer();
		togglePause();
	});
	$('#stop-button').click(function() {
		stop();
	});

	*/

	$('.more-info').click(function(e) {
		e.preventDefault();
		$('.info-drawer').slideToggle();
	});

	$('#start-button').click(function() {
		startTimer();
		$('#start-button').hide();
		$('#stop-button').show();
		$('.pause-panel').show();
		$('.gif-panel').slideDown();
	});
	$('#pause-button').click(function() {
		pauseTimer();
		$('#pause-button').hide();
		$('#resume-button').show();
	});
	$('#resume-button').click(function() {
		resumeTimer();
		$('#resume-button').hide();
		$('#pause-button').show();
	});
	$('#stop-button').click(function() {
		stopTimer();
		$('#stop-button').hide();
		$('.pause-panel').hide();
		$('#start-button').show();
		$('#resume-button').hide();
		$('#pause-button').show();
		$('.gif-panel').slideUp();
	});

};
$(document).ready(main);