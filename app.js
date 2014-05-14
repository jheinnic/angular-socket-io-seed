
/**
 * Module dependencies
 */

var express = require('express'),
  routes = require('./routes'),
  api = require('./routes/api'),
  http = require('http'),
  path = require('path'),
  fs = require('fs'),
  jade = require('jade'),
  lessMiddleware = require('less-middleware'),
  coffeeMiddleware = require('coffee-middleware');

var app = module.exports = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

/**
 * Configuration
 */

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.engine('html', jade.__express);
app.use(express.favicon());

if ('development' == app.get('env')) {
  app.use(express.logger('dev'));
} else if ('production' == app.get('env')) {
  app.use(express.logger('prd'));
} else {
  app.use(express.logger(app.get('env')));
}

app.use(express.bodyParser());
app.use(express.methodOverride());

app.use(express.static(path.join(__dirname, 'public')));
if (app.get('env') === 'development') {
  app.use(coffeeMiddleware({
    src: path.join(__dirname, 'public'),
    force: true,
    debug: true
  }));
  app.use(lessMiddleware(
    path.join(__dirname, 'public'), 
    {
      paths: [
        path.join(__dirname, 'public', 'bower_components', 'bootstrap', 'less'),
        path.join(__dirname, 'public')
      ],
      force: true,
      debug: true,
    }
  ));
} else {
  app.use(coffeeMiddleware({
    src: path.join(__dirname, 'public'),
    force: false,
    debug: false
  }));
  app.use(lessMiddleware(
    path.join(__dirname, 'public'), 
    {
      paths: [
        path.join(__dirname, 'public', 'bower_components', 'bootstrap', 'less'),
        path.join(__dirname, 'public')
      ],
      force: false,
      debug: false
    }
  ));
}

app.use(app.router);

if (app.get('env') === 'development') {
  // development only
  app.use(express.errorHandler());
} else if (app.get('env') === 'production') {
  // production only
  // TODO
};


/**
 * Routes
 */

// serve index and view partials
app.get('/', routes.index);
app.get('/partials/:name', routes.partials);

// JSON API
app.get('/api/name', api.name);

// redirect all others to the index (HTML5 history)
app.get('*', routes.index);

// Socket.io Communication
io.sockets.on('connection', require('./sockets'));

/**
 * Start Server
 */

server.listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});
