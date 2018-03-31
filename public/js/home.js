/*
 * File: home.js
 * Description: Javascript for the home page.
 */

/*
 * Main function
 */
var main = function () {
	$('.environment-submit').click(function() {
		$(this).closest('#environment-form').submit();
	});
};

$(document).ready(main);