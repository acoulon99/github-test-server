/**
 * GitHub Webhook Handler
 *   This collection of methods aids in handling github webhooks
 */
var testManager = require("../testing/test-manager");

/**
 * GitHub Webhook Event Handler
 *   payload - contains the entire payload from the GitHub Webhook
 */
exports.handleWebhook = function handleWebhook(payload, event, callback){

	// handle pull request events
	if(event === 'pull_request'){

		// set variables
		var action = payload["action"];

		// actions that spawn tests
		if(['opened', 'reopened', 'synchronize'].indexOf(action) > -1){

			// start tests
			testManager.beginTest(payload);

			// callback results
			var results = {
				"testing": true,
				"action": action,
				"event": event
			};
			callback(null, results);

		// other actions do not spawn tests
		} else {

			// callback results
			var results = {
				"testing": false,
				"action": action,
				"event": event
			};
			callback(null, results);
		}

	// not a pull request
	} else {

		// callback results
		var results = {
			"testing": false,
			"event": event
		};
		callback(null, results);
	}
};