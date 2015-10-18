var mongoose = require('mongoose');
var Report = mongoose.model('Report');
var handleWebhook = require('../../config/github/github-webhook').handleWebhook;

/**
 * <b>Handle Github Events</b>
 */
exports.handleGithubEvent = function(req, res){
	
	// set github event
	var event;
	if(req.headers['x-github-event']){
		event = req.headers['x-github-event'];
	} 
	else {
		event = 'ping';
	}

	// grab payload
	var payload = req.body;

	// handle the github request
	handleWebhook(payload, event, function handleWebhook(err, result){
		if(err){
			sendResponse(
				req, 
				res, 
				400, 
				"There was a problem processing the webhook.", 
				null, 
				err.message, 
				null
			);
		}
		else {
			sendResponse(
				req, 
				res, 
				200, 
				"Webhook successfully processed.", 
				result, 
				null, 
				null
			);
		}
	});
};