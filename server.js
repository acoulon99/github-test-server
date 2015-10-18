var config = require('./config/config');

var app = require('./config/express')();

app.listen(config.app.port);
console.log('Node server started on port ' + config.app.port + '.');