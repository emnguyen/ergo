/*
 * GET bookmarks page
 */

var data = require('../data.json');

exports.view = function(req, res) {
  res.render('bookmarks', {
  	data,
  	"title" : "Bookmarks | Ergo"
  });
};

/* Save bookmark */
exports.save = function(req, res) {
	// Get name and url of new bookmark
	var name = req.body.name;
	var url = req.body.url;

	// Create and push json object
	var bookmark = {
		"name" : name,
		"url" : url
	}
    data.loggedIn.bookmarks.push(bookmark); 
};

/* Delete bookmark */
exports.delete = function(req, res) {
	var name = req.body.name;
	var url = req.body.url;

	// Search for the targeted bookmark
	for (i in data.loggedIn.bookmarks) {
		var curr = data.loggedIn.bookmarks[i];

		// Once favorite is found, delete
		if (curr["name"] == name && curr["url"] == url) {
			delete data.loggedIn.bookmarks[i];
			break;
		}
	}
};