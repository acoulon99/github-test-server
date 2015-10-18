var coreCtrl = require('../controllers/core.controller.js');

module.exports = function(app) {

	// welcome
	app.route('/')
		.get(coreCtrl.serveHello);
};