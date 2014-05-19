
/**
 * Module dependencies
 */

var express = require('express'),
  path = require('path'),
  jade = require('jade'),
  lessMiddleware = require('less-middleware'),
  coffeeMiddleware = require('coffee-middleware');

/**
 * Configuration
 */
module.exports = function(app, cobrandPolicy) {
  // all environments
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
  
  app.use(express.json());
  app.use(express.urlencoded());
  app.use(express.methodOverride());
  
  app.use(express.static(path.join(__dirname, 'cobrands', 'public')));
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
};
