/*
 * main.js
 * Description: Main javascript.
 */

/* Name: parseDuration
 * Description: Converts the duration from string to seconds.
 * Parameters: durationStr - time as a string
 * Return: Returns the time in seconds.
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

/* Name: timeToS
 * Description: Convert time string to seconds.
 * Parameters: time - the inputed time string
 * Return: Returns the time in seconds.
 */
function timeToS(time) {
	var p = time.split(':'),
        s = 0, m = 1;

    while (p.length > 0) {
        s += m * parseInt(p.pop(), 10);
        m *= 60;
    }

    return s;
}

/* Name: sToTime
 * Description: Convert the time in seconds to a string.
 * Parameters: s - the time in seconds
 * Return: Return the time as a string.
 */
function sToTime(s) {
    var h = Math.floor(s/3600); //Get whole hours
    s -= h*3600;
    var m = Math.floor(s/60); //Get remaining minutes
    s -= m*60;

    if (h == 0)
    	return m+":"+(s < 10 ? '0'+s : s);

    return h+":"+(m < 10 ? '0'+m : m)+":"+(s < 10 ? '0'+s : s); //zero padding on minutes and seconds
}

/* Name: hideWelcome
 * Description: Hide the welcome message and save this setting
 *		in sessionStorage.
 * Parameters: None
 * Return: None
 */
function hideWelcome() {
	sessionStorage.setItem("hideWelcome", "true");
	$('#welcome').hide();
}

/* Name: goBack
 * Description: Go back one page in the window history.
 * Parameters: None
 * Return: None
 */
function goBack() {
	window.history.back();
}

/* Name: login
 * Description: Reset go page, submit login form, and update localStorage.
 * Parameters: None
 * Return: None
 */
function login() {
	resetGo();

  	localStorage.setItem("loggedIn", true);
	$('#login-form').submit();
}

/* Name: logout
 * Description: Logout by clearing localStorage fields.
 * Parameters: None
 * Return: None
 */
function logout() {
  window.location.href = "/logout";
  localStorage.removeItem("name");
  localStorage.setItem("loggedIn", false);

  if (localStorage.getItem("id")) {
  	localStorage.removeItem("id");
  	FB.logout(); 
  } 
}

/* Name: resetGo
 * Description: Reset go page by clearing localStorage fields.
 * Parameters: None
 * Return: None
 */
function resetGo() {
	localStorage.removeItem("status");
 	localStorage.removeItem("bookmark");
}

/* Name: signup
 * Description: Reset go page and log in as new user.
 * Parameters: None
 * Return: None
 */
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
 * Main function
 */
var main = function () {
	// For development only
	//localStorage.clear();

	var loggedIn = localStorage.getItem("loggedIn");

	// Reset bookmark if logged out
	if (loggedIn == false) {
		localStorage.removeItem("bookmark");
	}
	if (localStorage.getItem("name")) {
		$('#name').text(localStorage.getItem("name"));
	}

	// Highlight active menu item 
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
};

$(document).ready(main);