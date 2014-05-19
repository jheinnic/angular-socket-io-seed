'use strict';

// Declare app level module which depends on application sub-modules and 3rd-party dependencies

angular.module('irally', [
  'ngRoute', 'ir.navbar', 'btford.socket-io'
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
    when('/studentLobby', {
      templateUrl: 'partials/studentLobby',
      controller: 'TbdCtrl',
    }).
    when('/educatorView', {
      templateUrl: 'partials/educatorView',
      controller: 'TbdCtrl',
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
controller('TbdCtrl', ['$scope', 'socket', function ($scope, socket) {
}]).
controller('AppCtrl', ['$scope', 'socket', function ($scope, socket) {
  $scope.sessionModel = {
    username: null,
    displayName: null,
    authToken: null
  };

  $scope.logout = function() {
    $scope.sessionModel.username = null;
    $scope.sessionModel.displayName = null;
    $scope.sessionModel.authToken = null;
  };

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
  $scope.configModel = {
    headerText: "Sign in to " + $scope.cobrandModel.displayName + "'s educator portal",
    hasRegistration: false
  };
  $scope.doLogin = function() {
    // If API call to login service returns authentication credentials...
    $scope.$parent.sessionModel.username = $scope.loginModel.email;
    $scope.$parent.sessionModel.displayName = 'Display Name';
    $scope.$parent.sessionModel.authToken = 'Blahblahblah';

    $location.path('/educatorView');
   }
}]).
controller('PlayerLoginCtrl', ['$scope', '$location', function ($scope, $location) {
  $scope.loginModel = {
    email: null,
    password: null
  };
  $scope.configModel = {
    headerText: "Sign in to race!",
    hasRegistration: true
  };
  $scope.doLogin = function() {
    // If API call to login service returns authentication credentials...
    $scope.$parent.sessionModel.username = $scope.loginModel.email;
    $scope.$parent.sessionModel.displayName = 'Display Name';
    $scope.$parent.sessionModel.authToken = 'Blahblahblah';

    $location.path('/studentLobby');
  }
}]);

angular.bootstrap(document, ['irally']);
