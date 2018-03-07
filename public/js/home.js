/*
 * home.js
 */

var main = function () {
	$('.environment-submit').click(function() {
		//alert($('.environment-name').val());
		$(this).closest('#environment-form').submit();
	});
};

$(document).ready(main);