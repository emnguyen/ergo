function verifyGuestPhone() {
	// Reset warning
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

	$('#stretch-form').submit(); 
}

function sortStretches() {
	var stretches = $('.stretch-list>li');

	$.each(stretches, function() {
		if ($(this).hasClass('selected'))
			$(this).parent().prepend(this);
	});
}

function selectStretch(input) {
	var stretch = $(input).closest('.stretch');
	stretch.toggleClass('selected');

	// If stretch is selected, set value to 1 (true)
	if (stretch.hasClass('selected')) {
		stretch.find('.stretch-checkbox').val("1");
	}
	// Otherwise, set to 0 (false)
	else {
		stretch.find('.stretch-checkbox').val("0");
	}
}

/* For A/B testing */
function selectStretchAlt(input) {
	var stretch = $(input).closest('.stretch-alt');
	stretch.toggleClass('selected');

	// If stretch is selected, set value to 1 (true)
	if (stretch.hasClass('selected')) {
		stretch.find('.stretch-checkbox').val("1");
	}
	// Otherwise, set to 0 (false)
	else {
		stretch.find('.stretch-checkbox').val("0");
	}
}


function confirmStretchesLoggedIn() {
	// Reset fav and active flags
	stop();
	localStorage.removeItem("fav");

	console.log("confirm stretches logged in");
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
		$('#stretch-form').submit();
	}
}

function confirmStretches() {
	console.log("confirm stretches not logged in");
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
		$('#getPhoneModal').modal('show');
	}
}


var main = function () {
	sortStretches();

	// Toggle stretch description
	$('.expand-stretch').click(function() {
		$(this).closest('.stretch').find('.stretch-drawer').slideToggle(250);
		$(this).find('.chevron').toggleClass('oi-chevron-bottom');
		$(this).find('.chevron').toggleClass('oi-chevron-top');
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

	// Toggle stretch description
	$('.expand-stretch').click(function() {
		$(this).closest('.stretch-alt').find('.stretch-drawer').slideToggle(250);
		$(this).find('.chevron').toggleClass('oi-chevron-bottom');
		$(this).find('.chevron').toggleClass('oi-chevron-top');
	});

	// Toggle stretch desc with whole box
	$('#setup-page .stretch-info').click(function() {
		$(this).closest('.stretch-alt').find('.stretch-drawer').slideToggle(250);
		$(this).find('.chevron').toggleClass('oi-chevron-bottom');
		$(this).find('.chevron').toggleClass('oi-chevron-top');
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