'use strict';

// Declare app level module which depends on application sub-modules and 3rd-party dependencies

angular.module('irally', [
  'ngRoute', 'btford.socket-io'
]).
config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
  $routeProvider.
    when('/view1', {
      templateUrl: 'partials/partial1',
      controller: 'MyCtrl1'
    }).
    when('/view2', {
      templateUrl: 'partials/partial2',
      controller: 'MyCtrl2'
    }).
    otherwise({
      redirectTo: '/view1'
    });

  $locationProvider.html5Mode(true);
}]).
factory('socket', ['socketFactory', function (socketFactory) {
  return socketFactory();
}]).
value('version', '0.4.0'
).
filter('interpolate', ['version', function (version) {
  return function (text) {
    return String(text).replace(/\%VERSION\%/mg, version);
  }
}]).
directive('appVersion', ['version', function (version) {
  return function(scope, elm, attrs) {
    elm.text(version);
  };
}]).
controller('AppCtrl', ['$scope', 'socket', function ($scope, socket) {
  var recvName = function (data) {
    $scope.name = data.name;
  };
  socket.addListener('send:name', recvName);

  $scope.$on('$destroy', function() {
    socket.removeListener('send:name', recvName);
  });
}]).
controller('MyCtrl1', ['$scope', 'socket', function ($scope, socket) {
  var recvTime = function (data) {
    $scope.time = data.time;
  };
  socket.on('send:time', recvTime);

  $scope.$on('$destroy', function() {
    socket.removeListener('send:time', recvTime);
  });
}]).
controller('MyCtrl2', ['$scope', function ($scope) {
  // write Ctrl here
}]);
