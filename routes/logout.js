
/*
 * GET logout page.
 */

var data = require('../data.json');

exports.logout = function(req, res){
	data.loggedIn = false;
	data.setting = false;

	res.redirect('/');
};