
/**
 * Module dependencies
 */

var express = require('express'),
  path = require('path'),
  jade = require('jade'),
  vhost = require('vhost');
  lessMiddleware = require('less-middleware'),
  coffeeMiddleware = require('coffee-middleware');

/**
 * Configuration
 */
module.exports = function(app, io) {
  app.configure(function() {
    // all environments
    app.set('port', process.env.PORT || 3000);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.engine('html', jade.__express);
    app.use(express.favicon());
    
    if ('development' == app.get('env')) {
      app.use(express.logger('dev'));
    } else if ('staging' == app.get('env')) {
      app.use(express.logger('stg'));
    } else if ('production' == app.get('env')) {
      app.use(express.logger('prd'));
    } else {
      app.use(express.logger(app.get('env')));
    }
    
    app.use(express.json());
    app.use(express.urlencoded());
  
    // TODO: Use a real service and open a ZQN socket to be notified about changes/additions/deletions.
    var CobrandProvider = require('./cobrandProvider');
    CobrandProvider().findAll( function(cobrandArray) {
      cobrandArray.forEach( function(policy, idx) { 
        app.use(
          vhost(
            policy.portalUriRoot, require('../cobrand/app.js')(io, policy)
          )
        );
      });
    }); 
    vhost('*', app);
    
    if (app.get('env') === 'development') {
      // development only
      app.use(express.errorHandler());
    } else if (app.get('env') === 'staging') {
      // staging only
      app.use(express.errorHandler());
    } else if (app.get('env') === 'production') {
      // production only
    };
  });
}

