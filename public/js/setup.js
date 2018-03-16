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

function sortStretches() {
	var stretches = $('.stretch-list>li');

	$.each(stretches, function() {
		if ($(this).hasClass('selected'))
			$(this).parent().prepend(this);
	});
}

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

/* For A/B testing */
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


function confirmStretchesLoggedIn() {
	// Reset fav and active flags
	stop();
	localStorage.removeItem("fav");
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
		alert("You must select at least one stretch.");
		return;
	}
	else {
		if (parseInterval())
			$('#stretch-form').submit(); 
		else {
			$('.time-labels').addClass('warning');
			alert("Must enter an alert interval.");
		}
	}
}

function confirmStretches() {
	// Reset warning
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
		alert("You must select at least one stretch.");
		return;
	}
	else {
		//$('#getPhoneModal').modal('show');
		if (parseInterval())
			$('#stretch-form').submit(); 
		else {
			alert("Must enter an alert interval.");
			$('.time-labels').addClass('warning');
		}
	}
}

function parseInterval() {
	var interval = 0;

	var h = parseInt($('#h').val());
	interval += h * 3600;
	var m = parseInt($('#m').val());
	interval += m * 60;
	var s = parseInt($('#s').val());
	interval += s;

	if (interval > 0) {
		$('#interval-input').val(interval);
		localStorage.setItem("interval", interval);
		return true;
	}

	return false;
}



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

function getDuration($stretch) {
	return parseDuration($($stretch).find('.duration').text());
}

function incTotalDuration($stretch) {
	setTotalDuration(getTotalDuration() + getDuration($stretch));
}

function decTotalDuration($stretch) {
	setTotalDuration(getTotalDuration() - getDuration($stretch));
}

function getTotalDuration() {
	return timeToS($('.total-duration').attr('placeholder'));
}

function setTotalDuration(time) {
	$('.total-duration').attr('placeholder', sToTime(time));
}


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