var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;

SchoolPolicyProvider = function(host, port) {
  this.db= new Db('irally-v4', new Server(host, port, {journal: true}, {auto_reconnect: true, journal: true}, {journal: true}));
  this.db.open(function(){});
};


SchoolPolicyProvider.prototype.getCollection= function(callback) {
  this.db.collection('school_policies', function(error, school_policy_collection) {
  if( error ) callback(error);
  else callback(null, school_policy_collection);
  });
};

//find all school_policies
SchoolPolicyProvider.prototype.findAll = function(callback) {
  this.getCollection(function(error, school_policy_collection) {
    if( error ) callback(error)
    else {
    school_policy_collection.find().toArray(function(error, results) {
      if( error ) callback(error)
      else callback(null, results)
    });
    }
  });
};

//save new school_policy
SchoolPolicyProvider.prototype.save = function(school_policies, callback) {
  this.getCollection(function(error, school_policy_collection) {
    if( error ) callback(error)
    else {
      if( typeof(school_policies.length)=="undefined")
        school_policies = [school_policies];
  
      for( var ii=0; ii<school_policies.length; ii++ ) {
        school_policy = school_policies[ii];
        school_policy.created_at = new Date();
      }
  
      school_policy_collection.insert(school_policies, function(err) {
        if (err) {
          callback(err);
        } else {
          callback(null, school_policies);
        }
      });
    }
  });
};

exports.SchoolPolicyProvider = SchoolPolicyProvider;

