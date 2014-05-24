
/**
 * Module dependencies
 */

var express = require('express');
var app = module.exports = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

/**
 * Configuration
 */
require('./app/config')(app, io);

/**
 * Virtual host 
 */
// require('./app/routes')(app);
// require('./app/routes/api')(app);

// Socket.io Communication
// -- Nobody will connect to a socket of the root pseudo server, but lets exercise this anyhow.
// require('./app/sockets')(io);

/**
 * Start Server
 */

server.listen(app.get('port'), function () {
  console.log('Express server root listening on port ' + app.get('port'));
});
