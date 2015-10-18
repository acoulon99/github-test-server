module.exports = {
	app:{
		title: 'GitHub Integrated Test Server',
		description: 'Test server with integration into GitHub',
		port: process.env.PORT || 3000
	},
	tests: {
		maxSimultaneous: process.env.MAX_SIMULTANEOUS_TESTS || 1,
		launchScriptLocation: process.env.PROJECT_HOME ? process.env.PROJECT_HOME + '/bin/launch-test.sh' : '/home/vagrant/bin/launch-test.sh';
	},
	github: {
		accessToken: process.env.GITHUB_ACCESS_TOKEN,
		apiRetryMax: process.env.GITHUB_API_RETRY_MAX || 3
	},
	ssl: {
		enabled: false,
		cert: process.env.SSL_CERT,
		key: process.env.SSL_KEY
	}
};