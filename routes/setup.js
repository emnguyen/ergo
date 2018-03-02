
/*
 * GET stretches page.
 */

var data = require('../data.json');

exports.view = function(req, res){
	// Reset active
	for (var i in data.stretches) {
		data.stretches[i].active = false;	
	}

	var inputClass = req.query["name"];
	// Activate stretches for this environment

	for (var i in data.stretches) {
		var tags = data.stretches[i].tags;
		// Check all tags for a match
		for (var j in tags) {
			if (tags[j] == inputClass) {
				data.stretches[i].active = true;
			}
		}
	}

	data.setting = inputClass;

  res.render('setup', {
  	data,
  	"title" : "Setup | Ergo"
  });
};

exports.viewAlt = function(req, res){
	// Reset active
	for (var i in data.stretches) {
		data.stretches[i].active = false;	
	}

	var inputClass = req.query["name"];
	// Activate stretches for this environment

	for (var i in data.stretches) {
		var tags = data.stretches[i].tags;
		// Check all tags for a match
		for (var j in tags) {
			if (tags[j] == inputClass) {
				data.stretches[i].active = true;
			}
		}
	}

	data.setting = inputClass;

	// For A/B testing
	data.viewAlt = true;

  res.render('setupAlt', {
  	data,
  	"title" : "Setup | Ergo"
  });
};