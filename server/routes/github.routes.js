var mongoose = require('mongoose');
var githubCtrl = require('../controllers/github.controller.js');

module.exports = function(app) {

	app.route('/github/webhook')
		.post(githubCtrl.handleGithubEvent);
};