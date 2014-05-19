module.exports = function(globalSocket, cobrandConfig) {
  /**
   * Module dependencies
   */
  
  var express = require('express');
  //  http = require('http'),
  
  var app = express();
  // var server = require('http').createServer(app);
  // var io = require('socket.io').listen(server);

  /**
   * View variables from cobrand configuration
   */
  app.locals(cobrandConfig);

  /**
   * Configuration
   */
  var curieSuffix = cobrandConfig.curie.substring(8);
  // var cobrandSubdir = './app/' + curieSuffix;
  // var cobrandSubdir = './cobrand';
  var cobrandSubdir = './';
  require('./config')(app, express, cobrandConfig);
  
  /**
   * Routes to subdomain (main app) features.
   */
  require('./routes')(app, cobrandConfig),
  require('./routes/api')(app, cobrandConfig),
  
  /**
   * Socket.io Communication
   */
  require('./sockets/lobby')(globalSocket, cobrandConfig);

  // server.listen(app.get('port'), function () {
  //   console.log('Express server cobrand ' + cobrandConfig.portalUriRoot + ' listening on port ' + app.get('port'));
  // });

  return app;
}
