'use strict';

// Declare app level module which depends on application sub-modules and 3rd-party dependencies

angular.module('irally', [
  'ngRoute', 'ir-navbar', 'btford.socket-io'
]).
config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
  $routeProvider.
    when('/login/educator', {
      templateUrl: 'partials/loginForm',
      controller: 'EducatorLoginCtrl'
    }).
    when('/login/player', {
      templateUrl: 'partials/loginForm',
      controller: 'PlayerLoginCtrl'
    }).
    otherwise({
      redirectTo: '/'
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
controller('EducatorLoginCtrl', ['$scope', '$location', function ($scope, $location) {
  $scope.loginModel = {
    email: null,
    password: null
  };
  $scope.optionsModel = {
    headerText: "Sign in to iRally's educator portal site",
    hasRegistration: false
  };
  $scope.doLogin = function() {
    // If API call to login service returns authentication credentials...
    $scope.$parent.sessionModel.username = $scope.loginModel.email;
    $scope.$parent.sessionModel.authToken = 'Blahblahblah';

    //$location.
   }
}]).
controller('PlayerLoginCtrl', ['$scope', function ($scope) {
  // write Ctrl here
}]);
