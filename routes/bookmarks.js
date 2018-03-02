
/*
 * GET favorites page.
 */

var data = require('../data.json');

exports.view = function(req, res){
  res.render('bookmarks', {
  	data,
  	"title" : "Favorites | Ergo"
  });
};

exports.save = function(req, res){
	// Get name and url of new fav
	var name = req.body.name;
	var url = req.body.url;

	// Create and push json object
	var favorite = {
		"name" : name,
		"url" : url
	}
    data.loggedIn.favorites.push(favorite); 

    return;
};

exports.delete = function(req, res){
	var name = req.body.name;
	var url = req.body.url;

	// Search for the targeted favorite
	for (i in data.loggedIn.favorites) {
		var currFav = data.loggedIn.favorites[i];

		// Once favorite is found, delete
		if (currFav["name"] == name && currFav["url"] == url) {
			delete data.loggedIn.favorites[i];
			break;
		}
	}
};