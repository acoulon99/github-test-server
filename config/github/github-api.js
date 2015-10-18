/**
 * GitHub API Client
 *   This collection of methods for interacting with the GitHub API
 */
var GithubApi = require("github");
var statusAccessToken = require("../config").github.statusAccessToken;
var comRetryMax = require("../config").github.comRetryMax;
var async = require('async');

/**
 * GitHub API client
 */
var githubClient = new GithubApi({
    version: "3.0.0",
    protocol: "https",
    host: "api.github.com",
    timeout: 5000,
    headers: {
        "user-agent": "Roll-Forward-Server" // GitHub is happy with a unique user agent
    }
});

/**
 * Update Commit Status
 */
exports.createCommitStatus = function createCommitStatus(statusOptions, callback){

	// breakout status options
	var user = statusOptions.user;
	var repo = statusOptions.repo;
	var sha = statusOptions.sha;
	var state = statusOptions.state;
	var description = statusOptions.description;
	var context = statusOptions.context;

	// retry up to max retries
	async.retry(comRetryMax, function(retryCallback, results){

		// set single-use authentication
		githubClient.authenticate({
		    type: "oauth",
		    token: statusAccessToken
		});

		// send create status communication
		githubClient.statuses.create({
			user: user,
			repo: repo,
			sha: sha,
			state: state,
			description: description,
			context: context
		}, function(err, res){ // handle conditions
			if(err){
				retryCallback(err);
			} else {
				retryCallback(null, res);
			}
		});

	}, function(err, res){
		if(err){
			callback(err)
		} else {
			callback(null, res);
		}
	});
};