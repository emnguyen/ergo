
/*
 * GET signup page
 */

var data = require('../data.json');

exports.view = function(req, res) {
	res.render('signup', {
		data,
		"title" : "Sign Up | Ergo",
		"hideTabs" : true,
		"hideLogin" : true
	});
};

/* Verify sign up */
exports.verify = function(req, res) {
	var firstName = req.query["firstName"];
	var lastName = req.query["lastName"];
	var email = req.query["email"];
	var pwd = req.query["pwd"];
	var phone = req.query["phone"];
	var signupError;

	// Check for existing email
	for (i in data.users) {
		var currUser = data.users[i];

		if (email == currUser.email) {
				res.render('signup', {
			  	data,
			  	"title" : "Sign Up | Ergo",
			  	"signupError" : "Email address already belongs to an account."
		 	 });
			return;
		}
	}

	// If valid new account, push user
	var newUser = {
		"firstName" : firstName,
		"lastName" : lastName,
		"email" : email,
		"pwd" : pwd,
		"phone" : phone,
		"favorites" :[
		]
	};
	data.phone = newUser.phone;
	data.loggedIn = newUser;

	res.redirect('/');
};