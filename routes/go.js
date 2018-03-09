
/*
 * GET go page.
 */

var data = require('../data.json');
var user = require('../public/user.json');

exports.view = function(req, res){
	// Clear todo queue
	data.todo = [];

	// Store interval
	data.interval = req.query["interval"];

	var selected = req.query;

	// Redirect to home is queue is empty
	if (!selected.length) {
		//res.redirect('/');
		//return;
	}

	for (var i in selected) {
		if (selected[i] == 1) { 
			var stretch = data.stretches[i];
			data.todo.push(stretch);
		}
	}

  res.render('go', {
  	data,
  	user,
  	"title" : "Go! | Ergo"
  });
};