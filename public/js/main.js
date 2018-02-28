/*
 * main.js
 * Description: Main javascript.
 */

function hideWelcome() {
	localStorage.setItem("hideWelcome", "true");
	$('#welcome').hide();
}

function goBack() {
	window.history.back();
}

function login() {

	//localStorage.setItem("name", "Placeholder");
  	localStorage.setItem("loggedIn", true);

	$('#login-form').submit();
}

function signup() {
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


/* Name: enterPhone
 * Description: Called when not logged in. Verifies inputed phone number
 * before saving it to the database.
 * Parameters: None
 * Return: None
 */

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

function confirmStretchesLoggedIn() {
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

/*
 * main
 */
var main = function () {
	// For development only
	//localStorage.clear();

	var loggedIn = localStorage.getItem("loggedIn");

	if (localStorage.getItem("name")) {
		$('#fb-name').text(localStorage.getItem("name"));
		$('#profile-pic').attr("src", localStorage.getItem("profile-pic"));
	}

	/* Highlight active menu item */
  	var url = window.location.href;
    $('.nav-link').filter(function() {
        return this.href == url;
    }).addClass('active'); 

    sortStretches();

	// Toggle stretch description
	$('.expand-stretch').click(function() {
		$(this).closest('.stretch').find('.stretch-desc').slideToggle(250);
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



// Submitting a guest phone number with enter
$('#phoneInput').on('click keypress', function(e) {
	if (e.type == 'keypress' && e.keyCode == 13) {
		e.preventDefault();
        verifyGuestPhone();
    }
});

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