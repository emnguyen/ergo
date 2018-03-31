/*
 * GET login page
 */

var data = require('../data.json');

exports.view = function(req, res) {
  res.render('login', {
  	data,
  	"title" : "Log In | Ergo",
  	"hideTabs" : true,
  	"hideLogin" : true
  });
};

/* Verify log in */
exports.verify = function(req, res) {
	var email = req.query["email"];
	var pwd = req.query["pwd"];
	var loginError;

	// Check for email/pwd
	for (i in data.users) {
		var currUser = data.users[i];

		// If email exists
		if (email == currUser.email) {
			// If email exists and pwd matches, log in
			if (pwd == currUser.pwd) {
				data.loggedIn = currUser;
				data.phone = currUser.phone;
				res.redirect('/');
				return;
			}
			// Otherwise, return incorrect pwd error
			else {
				res.render('login', {
				  	data,
				  	"title" : "Login | Ergo",
				  	"hideTabs" : true,
				  	"hideLogin" : true,
				  	"loginError" : "Incorrect password."
				 });
				return;
			}		
		}
	}

	// If no account found for this email
	res.render('login', {
		data,
		"title" : "Login | Ergo",
		"loginError" : "Email address does not belong to an account."
	});
};

/* Log in with FB */
exports.fb = function(req, res) {
	var userid = req.params.id;

	// Login user if they've already logged in
	for (i in data.users) {
		var currUser = data.users[i];
		if (currUser.id == userid) {
			data.loggedIn = currUser;
			res.redirect('/');
			return;
		}
	}

	// Otherwise, create new user
	var newUser = {
		"id" : userid,
		"bookmarks" : []
	};

	data.setting = false;
	data.loggedIn = newUser;
	data.users.push(newUser);

 	res.redirect('/');
};