/*
 * main.js
 * Description: Main javascript.
 */

function parseDuration(durationStr) {
	var duration = parseInt(durationStr); 

	// If input is in minutes, convert to seconds
	if (durationStr.indexOf("min") >= 0) {
		return duration *= 60;
	}
	else {
		return duration;
	}
}

 function timeToS(time) {
 	/*
	var totalS = 0;
	// Get hours
	// Get minutes
	var m = parseInt(time.substr(0, time.indexOf(':')));
	totalS += m * 60;
	// Get seconds
	var s = parseInt(time.split(':')[1]);
	totalS += s; 

	return totalS; */

	var p = time.split(':'),
        s = 0, m = 1;

    while (p.length > 0) {
        s += m * parseInt(p.pop(), 10);
        m *= 60;
    }

    return s;
}

function sToTime(s) {
    var h = Math.floor(s/3600); //Get whole hours
    s -= h*3600;
    var m = Math.floor(s/60); //Get remaining minutes
    s -= m*60;

    if (h == 0)
    	return m+":"+(s < 10 ? '0'+s : s);

    return h+":"+(m < 10 ? '0'+m : m)+":"+(s < 10 ? '0'+s : s); //zero padding on minutes and seconds
}

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
  localStorage.setItem("loggedIn", false);

  if (localStorage.getItem("id")) {
  	localStorage.removeItem("id");
  	FB.logout(); 
  } 
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


 /*

function start() {
	$('#status-container').removeClass('pause');
	$('#status-container').slideDown();
	$('#start-button').hide();
	$('#stop-button').show();
	$('.pause-panel').show();
	//$('.gif-panel').slideDown();
	localStorage.setItem("status", "active");

	//var $firstStretch = $('.curr-stretch').first();
	//startStretch($firstStretch);
}

function stop() {
	$('#status-container').slideUp();
	$('#start-button').show();
	$('#stop-button').hide();
	$('.pause-panel').hide();
	//$('.gif-panel').slideUp();
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
*/


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

	/*
    var status;
    if (status = localStorage.getItem("status")) {
  		if (status == "paused") {
  			togglePause();
  		}

  		// temp
  		$('.gif-panel').show();
  		var $firstStretch = $('.curr-stretch').first();
		
		//startStretch($firstStretch);

    	$('#status-container').show();

    	$('#status-container').click(function() {
    		// Set status container link
    		go = localStorage.getItem("go");
    		window.location.href = go;
    	});
    }
	*/
   
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



};

$(document).ready(main);