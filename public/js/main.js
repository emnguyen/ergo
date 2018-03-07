/*
 * main.js
 * Description: Main javascript.
 */

function hideWelcome() {
	sessionStorage.setItem("hideWelcome", "true");
	$('#welcome').hide();
}

function goBack() {
	window.history.back();
}

function login() {
	resetGo();

  	localStorage.setItem("loggedIn", true);
	$('#login-form').submit();
}

function logout() {
  window.location.href = "/logout";
  localStorage.removeItem("name");
  localStorage.removeItem("id");
  localStorage.setItem("loggedIn", false);

  resetGo();  

  FB.logout(); 
}

function resetGo() {
	stop();
	localStorage.removeItem("status");
 	localStorage.removeItem("fav");
}

function signup() {
	resetGo();
	
	// Clear warnings
	$('.warning').text("");

	var email = document.getElementsByName("email")[0].value;
	var password = document.getElementsByName("password")[0].value;
	var phone = document.getElementsByName("phone")[0].value;

	
	// Check inputed email and password
	var validEmail = checkEmail(email);
	var validPassword = checkPassword(password);
	var validPhone = checkPhone(phone);


	// Return if one or more inputs are valid
	if (!validEmail || !validPassword || !validPhone)
		return;

	window.location.href = "/";
}




 function startStretch($currStretch) {
	// Return if STOP
	if (!localStorage.getItem("status"))
		return;

	$($currStretch).addClass('active');

	// TEMP: 5 second intervals
	var $seconds = $($currStretch).find('.seconds');
	var duration = parseInt($($seconds).text());


	var counter = duration;

	var interval = setInterval(function() {
	    counter--;

	    // Prepend 0 if necessary
	    var num = counter;
	    if (counter < 10) {
	    	num = "0" + num;
	    }
	    $($seconds).text(num);

	    // When 0 is reached
	    if (counter == 0) {
	        clearInterval(interval);
	        // Reset duration
	        $($seconds).text(duration);

        	// Get next stretch
			var $nextStretch = $($currStretch).next();

			// Return to beginning of stretch list if end reached
			if ($nextStretch.length == 0) {
				$nextStretch = $('.curr-stretch').first();
			}

			$($currStretch).removeClass('active');
			
			return startStretch($nextStretch);
	    }
	}, 1000);	
}


function start() {
	$('#status-container').removeClass('pause');
	$('#status-container').slideDown();
	$('#start-button').hide();
	$('#stop-button').show();
	$('.pause-panel').show();
	$('.gif-panel').slideDown();
	localStorage.setItem("status", "active");

	var $firstStretch = $('.curr-stretch').first();
	startStretch($firstStretch);
}

function stop() {
	$('#status-container').slideUp();
	$('#start-button').show();
	$('#stop-button').hide();
	$('.pause-panel').hide();
	$('.gif-panel').slideUp();
	localStorage.removeItem("status");
}

function togglePause() {
	$('#status-container').toggleClass('pause');
	$('#pause-button').toggleClass('oi-media-pause');
	$('#pause-button').toggleClass('oi-media-play');
	$('#status').text(function(i, text) {
		if (text === "Active")
			localStorage.setItem("status", "paused");
		else
			localStorage.setItem("status", "active");
		return text === "Active" ? "Paused" : "Active";
	});
}

/*
 * main
 */
var main = function () {
	// For development only
	//localStorage.clear();

	var loggedIn = localStorage.getItem("loggedIn");

	// Reset fav if logged out
	if (loggedIn == false) {
		localStorage.removeItem("fav");
	}

	if (localStorage.getItem("name")) {
		$('#name').text(localStorage.getItem("name"));
	}

	/* Highlight active menu item */
  	var url = window.location.href;
    $('.nav-link').filter(function() {
        return this.href == url;
    }).addClass('active'); 
    // Handle dropdown
    var shortUrl = window.location.pathname.split( '/' );
    if (shortUrl == ",login") {
    	$('.login-nav-link').addClass('dropdown-active');
    	$('.login-nav-link-md').addClass('active');
    }
    else if (shortUrl == ",signup") {
    	$('.login-nav-link').addClass('dropdown-active');
    	$('.signup-nav-link-md').addClass('active');
    }
/*
    var go;
    if (go = localStorage.getItem("go")) {
    	$('#status-container').click(function() {
    		window.location.href = go;
    	});
    }
*/
    var status;
    if (status = localStorage.getItem("status")) {
  		if (status == "paused") {
  			togglePause();
  		}

  		// temp
  		$('.gif-panel').show();
  		var $firstStretch = $('.curr-stretch').first();
		startStretch($firstStretch);

    	$('#status-container').show();

    	$('#status-container').click(function() {
    		// Set status container link
    		go = localStorage.getItem("go");
    		window.location.href = go;
    	});
    }

    

/*
	$('.confirm-stretches').click(function(e) {
		var empty = true;
		// Submit form if at least one stretch is selected
		$('.stretch-checkbox').each(function() {
			if ($(this).val() == "1") {
				empty = false;
			}
		});

		// Otherwise, show warning
		if (empty) {
			alert("You must select at least one stretch.");
			e.preventDefault();
		}

	}); 
*/





	/* Timer */
	var Clock = {
		  totalSeconds: 0,

		  start: function () {
		  	
		    var self = this;
				function pad(val) { return val > 9 ? val : "0" + val; }
		    this.interval = setInterval(function () {
		      self.totalSeconds += 1;

		      
		      $("#min").text(pad(Math.floor(self.totalSeconds / 60 % 60)));
		      $("#sec").text(pad(parseInt(self.totalSeconds % 60)));
		    }, 1000);
		  },
		  
		  reset: function () {
		  	Clock.totalSeconds = null; 
		    clearInterval(this.interval);
		    $("#min").text("00");
		    $("#sec").text("00");
		  },
		  pause: function () {
		    clearInterval(this.interval);
		    delete this.interval;
		  },

		  resume: function () {
		    if (!this.interval) this.start();
		  },
		  
		  restart: function () {
		  	 this.reset();
		     Clock.start();
		  }
	};


	$('#startButton').click(function () {
		Clock.start(); 
		$(this).hide();
		$('#resumeButton').show();
		$('#pauseButton').show();
		$('#resetButton').show();
	});
	$('#pauseButton').click(function () { Clock.pause(); });
	$('#resumeButton').click(function () { Clock.resume(); });
	$('#resetButton').click(function () {
		Clock.reset(); 
		$(this).hide();
		$('#startButton').show();
		$('#pauseButton').hide();
		$('#resetButton').hide();
		$('#resumeButton').hide();
	});
	$('#restartButton').click(function () { Clock.restart(); });

	/* Favorite */

};

$(document).ready(main);