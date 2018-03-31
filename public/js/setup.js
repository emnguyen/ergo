/*
 * File: setup.js
 * Description: Javascript for the Setup page.
 */

/* Name: verifyGuestPhone
 * Description: Check that the inputed guest phone number is valid before
 *		submitting stretch form.
 * Parameters: None
 * Return: None
 */
function verifyGuestPhone() {
	// Reset warning
	/*
	$('.phoneInputWarning').text("");

	// Verify phone number

	var phoneInput = $('#phoneInput').val();
	// Return and show warning if input is empty
	if (phoneInput.length == 0) {
		$('.phoneInputWarning').text("Must enter a phone number.");
		return;
	}
	// Return and show warning if input is not 9-10 digits
	else if (phoneInput.length != 9 && phoneInput.length != 10) {
		$('.phoneInputWarning').text("Not a valid phone number.");
		return;
	}

	//var stretchForm = $("#stretch-form");
	//var url = stretchForm.attr('action') + "?" + stretchForm.serialize();

	// Save guest phone
	//sessionStorage.setItem('guestPhone', phoneInput);
	*/
	$('#stretch-form').submit(); 
}

/* Name: sortStretches
 * Description: Push preselected to the top of the stretch list.
 * Parameters: None
 * Return: None
 */
function sortStretches() {
	var stretches = $('.stretch-list>li');

	$.each(stretches, function() {
		if ($(this).hasClass('selected'))
			$(this).parent().prepend(this);
	});
}

/* Name: selectStretch
 * Description: Select/deselect stretch by setting its checkbox field to 1/0.
 * Parameters: $input - the selected stretch object
 * Return: None
 */
function selectStretch($input) {
	var $stretch = $($input).closest('.stretch');
	$stretch.toggleClass('selected');

	// If stretch is selected, set value to 1 (true)
	if ($stretch.hasClass('selected')) {
		$stretch.find('.stretch-checkbox').val("1");
		incTotalDuration($stretch);
	}
	// Otherwise, set to 0 (false)
	else {
		$stretch.find('.stretch-checkbox').val("0");
		decTotalDuration($stretch);
	}
}

/* Name: selectStretchAlt
 * Description: selectStretch function for alt page. Used for A/B testing.
 * Parameters: $input - the selected stretch object
 * Return: None
 */
function selectStretchAlt($input) {
	var $stretch = $($input).closest('.stretch-alt');
	$stretch.toggleClass('selected');

	// If stretch is selected, set value to 1 (true)
	if ($stretch.hasClass('selected')) {
		$stretch.find('.stretch-checkbox').val("1");
		incTotalDuration($stretch);
	}
	// Otherwise, set to 0 (false)
	else {
		$stretch.find('.stretch-checkbox').val("0");
		decTotalDuration($stretch);
	}
}

/* Name: confirmStretchesLoggedIn
 * Description: Check that at least one stretch is selected before submitting.
 * Parameters: None
 * Return: None
 */
function confirmStretchesLoggedIn() {
	// Reset bookmark and active flags
	localStorage.removeItem("bookmark");
	$('.time-labels').removeClass('warning');

	var empty = true;

	// Submit form if at least one stretch is selected
	$('.stretch-checkbox').each(function() {
		if ($(this).val() == "1") {
			empty = false;
		}
	});

	// Otherwise, show warning
	if (empty) {
		// Toggle warning modal
		$("#no-stretches").modal('show');
		return;
	}
	else {
		if (parseInterval())
			$('#stretch-form').submit(); 
		else {
			$('.time-labels').addClass('warning');
			$("#no-interval").modal('show');
		}
	}
}

/* Name: confirmStretches
 * Description: Check that at least one stretch is selected and request
 *		a guest phone number before submitting.
 * Parameters: None
 * Return: None
 */
function confirmStretches() {
	// Reset bookmark and active flags
	localStorage.removeItem("bookmark");
	$('.time-labels').removeClass('warning');

	var empty = true;

	// Submit form if at least one stretch is selected
	$('.stretch-checkbox').each(function() {
		if ($(this).val() == "1") {
			empty = false;
		}
	});

	// Otherwise, show warning
	if (empty) {
		// Toggle warning modal
		$("#no-stretches").modal('show');
		return;
	}
	else {
		//$('#getPhoneModal').modal('show');
		if (parseInterval())
			$('#stretch-form').submit(); 
		else {
			$('.time-labels').addClass('warning');
			$("#no-interval").modal('show');
		}
	}
}

/* Name: parseInterval
 * Description: Convert interval from string to seconds and check validity
 *		before filling out form.
 * Parameters: None
 * Return: Return true if interval > 0, return false if otherwise.
 */
function parseInterval() {
	var interval = 0;

	var h = parseInt($('#h').val());
	interval += h * 3600;
	var m = parseInt($('#m').val());
	interval += m * 60;
	var s = parseInt($('#s').val());
	interval += s;

	// Fill out form field if valid interval
	if (interval > 0) {
		$('#interval-input').val(interval);
		localStorage.setItem("interval", interval);
		return true;
	}

	return false;
}

/* Name: sumDuration
 * Description: Sum the durations of the selected stretches and update
 *		the displayed total duration.
 * Parameters: None
 * Return: Return the total duration as a string.
 */
function sumDuration() {
	var totalDuration = 0;

	// Iterate through stretches
	$('.stretch').each(function() {
		// If stretch is selected, add its duration to the total
		if ($(this).hasClass('selected')) {
			var duration = getDuration($(this));
			totalDuration += duration;
		}
	});

	setTotalDuration(totalDuration);
	return totalDuration;
}

/* Name: getDuration
 * Description: Convert the inputed stretch's duration to seconds and return.
 * Parameters: $stretch - the stretch whose duration we're returning.
 * Return: Return the inputed stretch's duration in seconds.
 */
function getDuration($stretch) {
	return parseDuration($($stretch).find('.duration').text());
}

/* Name: incTotalDuration
 * Description: Increase the total duration by the inputed stretch's duration.
 * Parameters: $stretch - the stretch whose duration we're incrementing the
 *		total duration by
 * Return: None
 */
function incTotalDuration($stretch) {
	setTotalDuration(getTotalDuration() + getDuration($stretch));
}

/* Name: decTotalDuration
 * Description: Decrease the total duration by the inputed stretch's duration.
 * Parameters: $stretch - the stretch whose duration we're decrementing the
 *		total duration by
 * Return: None
 */
function decTotalDuration($stretch) {
	setTotalDuration(getTotalDuration() - getDuration($stretch));
}

/* Name: getTotalDuration
 * Description: Convert the total duration from a string to seconds
 *		and return.
 * Parameters: None
 * Return: Return the total duration in seconds.
 */
function getTotalDuration() {
	return timeToS($('.total-duration').attr('placeholder'));
}

/* Name: setTotalDuration
 * Description: Convert the inputed time from seconds to a string and display.
 * Parameters: time - the inputed duration in seconds
 * Return: None
 */
function setTotalDuration(time) {
	$('.total-duration').attr('placeholder', sToTime(time));
}

/* Name: appendIntervalOptions
 * Description: Append options to interval selection fields.
 * Parameters: None
 * Return: None
 */
function appendIntervalOptions() {
	var i;
	for (i = 0; i < 60; i++) {
		var option = document.createElement("option");
		if (i < 10) {
			option.text = "0" + i;
		}
		else {
			option.text = i;
		}

		$('#m').append(option);
	}

	for (i = 0; i < 60; i++) {
		var option = document.createElement("option");
		if (i < 10) {
			option.text = "0" + i;
		}
		else {
			option.text = i;
		}

		$('#s').append(option);
	}

	for (i = 0; i <= 8; i++) {
		var option = document.createElement("option");
		option.text = i;
		$('#h').append(option);
	}
}

/*
 * Main function
 */
var main = function () {
	sortStretches();
	sumDuration();

	appendIntervalOptions();

	// Toggle stretch description
	$('.expand-stretch').click(function() {
		ga("send", "event", "expand", "click");
		$(this).closest('.stretch').find('.stretch-drawer').slideToggle(250);
		// A/B
		$(this).closest('.stretch-alt').find('.stretch-drawer').slideToggle(250);
		
		$(this).find('.chevron').toggleClass('chevron-down');
		$(this).find('.chevron').toggleClass('chevron-up');
	});

	// Toggle select stretch
	$('#setup-page .stretch-info').click(function() {
		selectStretch(this);
	});

	// Toggle select stretch
	$('#setup-page .stretch-image').click(function() {
		selectStretch(this);
	});

	/***** A/B *****/
	// Toggle select stretch
	$('#setup-page .stretch-check').click(function() {
		selectStretchAlt(this);
	});

	// Toggle stretch desc with whole box
	$('.stretch-alt .stretch-info').click(function() {
		ga("send", "event", "expand", "click");
		$(this).closest('.stretch-alt').find('.stretch-drawer').slideToggle(250);

		$(this).parent().find('.chevron').toggleClass('chevron-down');
		$(this).parent().find('.chevron').toggleClass('chevron-up');
	});

	/***************/

	// Submitting a guest phone number with enter
	$('#phoneInput').on('click keypress', function(e) {
		if (e.type == 'keypress' && e.keyCode == 13) {
			e.preventDefault();
	        verifyGuestPhone();
	    }
	});
};

$(document).ready(main);