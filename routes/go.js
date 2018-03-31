
/*
 * GET go page
 */

var data = require('../data.json');

exports.view = function(req, res) {
	// Clear todo queue
	data.todo = [];

	// Store interval + selected stretches
	data.interval = req.query["interval"];
	var selected = req.query;

	// Push selected stretches into todo queue
	for (var i in selected) {
		if (selected[i] == 1) { 
			var stretch = data.stretches[i];
			data.todo.push(stretch);
		}
	}

  res.render('go', {
  	data,
  	"title" : "Go! | Ergo"
  });
};