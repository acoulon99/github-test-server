/**
 * Roll Forward Test Manager
 *   This file will control the testing queue and update github with appropriate status
 */
var githubApi = require('../github/github-api');
var maxTests = require('../config').test.maxTests;
var testScriptLocation = require('../config').test.testScriptLocation;
var runtimeHome = require('../config').runtimeHome;
var util  = require('util');
var spawn = require('child_process').spawn;
var glob = require('glob');
var fs = require('fs');	
var xml2js = require('xml2js');

/**
 * Test Queue
 */
var testQueue = [];
var maxTestVms = 1;
var currentTestVms = 0;


/**
 * Adds a test to the test queue
 */
function addToTestQueue(repositoryOwner, repositoryName, branchName, statusOptions){

	// build test info
	var testInfo = {
		repositoryOwner: repositoryOwner,
		repositoryName: repositoryName,
		branchName: branchName,
		statusOptions: statusOptions
	}

	// add info to queue
	testQueue.push(testInfo);

	// progress tests
	progressTests();
}

/**
 * progresses the test queue if vms available
 */
function progressTests(){

	// if the queue is empty, do nothing
	if (testQueue.length == 0){
		console.log('Currently the test queue is empty.');

	// if test stations available
	} else if(currentTestVms < maxTestVms){

		// grab the next test out of the queue
		var testInfo = testQueue.shift();

		// launch test
		console.log('launching test: ', testInfo);
		launchTest(testInfo);

	// no stations available
	} else {
		console.log('No test stations available. Please wait..');
	}
}

/**
 * launches the script to start the test
 */
function launchTest(testInfo){

	// repository information
	var repoFullName = testInfo.repositoryOwner + '/' + testInfo.repositoryName;
	var branch = testInfo.branchName;
	var statusOptions = testInfo.statusOptions;

	// output
	var stdoutData = [];
	var stderrData = [];

	// spawn the test and increment the test counter
	testSpawn = spawn('bash', [testScriptLocation, repoFullName, branch]);
	currentTestVms++;

	// gather stdout
	testSpawn.stdout.on('data', function(data){
		stdoutData.push(data.toString());
	});

	// gather stderr
	testSpawn.stderr.on('data', function(data){
		stderrData.push(data.toString());
	});

	// on exit
	testSpawn.on('exit', function(code){

		// decrement the test counter
		currentTestVms--;

		// progress tests
		progressTests();

		if(code == 0){ // successful finish

			// handle result
			handleSpawnOutput(null, stdoutData, stderrData, statusOptions);

		} else {

			// handle result
			var err = new Error('Script exited with code: ' + code);
			handleSpawnOutput(err, stdoutData, stderrData, statusOptions);
		}			
	});
}

/**
 * handles script output
 */
function handleSpawnOutput(err, stdoutData, stderrData, statusOptions){

	if(err){

		// send error status to github
		statusOptions.state = 'error';
		statusOptions.description = err.message;

		// send a status (async)
		githubApi.createCommitStatus(statusOptions, function(err, res){
			if(err){
				console.error(err);
			} else {
				console.log(res);
			}
		});
	} else {

		// glob all of the test results (sorted by default)
		glob(runtimeHome + '/logs/server/mocha-test-result.*.xml', {}, function(err, testResults){
			if(err){

				statusOptions.state = 'error';
				statusOptions.description = err.message;
				console.log(err);

				// send a status (async)
				githubApi.createCommitStatus(statusOptions, function(err, res){
					if(err){
						console.error(err);
					} else {
						console.log(res);
					}
				});

			} else {

				// parse the test results
				var parser = new xml2js.Parser();
				fs.readFile(testResults.pop(), function(err, data) {
				    parser.parseString(data, function (err, result) {

				    	// grab the results
				    	var summary = result["testsuite"]["$"];
				    	var tests = Number(summary["tests"]);
				    	var failures = Number(summary["failures"]);
				    	var errors = Number(summary["errors"]);
				    	var skipped = Number(summary["skipped"]);
				    	var time = Number(summary["time"]);
				    	var timestampString = summary["timestamp"];
				    	var completedTests = tests - skipped - failures - errors;

				    	// check test results and set status
				    	if (skipped > 0 && errors === 0 && failures === 0){
				    		statusOptions.state = 'success';
				    		statusOptions.description = 'Build succeeded, ' + completedTests + '/' + tests + ' tests passing, but ' + skipped + ' test(s) skipped.';
				    	} else if (errors > 0 || failures > 0){
				    		statusOptions.state = 'failure';
				    		statusOptions.description = 'Build failed with ' + completedTests + '/' + tests + ' tests passing, and ' + skipped + ' test(s) skipped.';
				    	} else {
				    		statusOptions.state = 'success';
				    		statusOptions.description = 'Build succeeded with ' + completedTests + '/' + tests + ' tests passing.';
				    	}

						// send a status (async)
						githubApi.createCommitStatus(statusOptions, function(err, res){
							if(err){
								console.error(err);
							} else {
								console.log(res);
							}
						});
				    });
				});
			}
		});
	}
}

/**
 * Begin a new test
 */
exports.beginTest = function(payload){

	// generate targetUrl for the status/test (might have to be part of the test starting process)
	var targetUrl = 'www.slowmotionpuppies.com';

	// set repository/branch information
	var repositoryOwner = payload["repository"]["owner"]["login"];
	var repositoryName = payload["repository"]["name"];
	var branchName = payload["pull_request"]["head"]["ref"];

	// set status options to pending
	var statusOptions = {
		user: payload["repository"]["owner"]["login"],
		repo: payload["repository"]["name"],
		sha: payload["pull_request"]["head"]["sha"],
		state: 'pending', // set state initially to pending
		description: 'Building and testing are in progress.',
		context: 'roll-forward/continuous-integration',
		target_url: targetUrl
	};

	// send a pending status (async)
	githubApi.createCommitStatus(statusOptions, function(err, res){
		if(err){
			console.error(err);
		} else {
			console.log(res);
		}
	});

	// add test to queue
	addToTestQueue(repositoryOwner, repositoryName, branchName, statusOptions);
};