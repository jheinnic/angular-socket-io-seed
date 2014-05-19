'use strict';

// Declare app level module which depends on application sub-modules and 3rd-party dependencies

angular.module('irally', [
  'ngRoute', 'ir.navbar', 'ir.lobby', 'btford.socket-io'
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
      templateUrl: 'partials/studentLobby'
    }).
    when('/educatorView', {
      templateUrl: 'partials/educatorView'
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
factory('cobrandCurie', function() {
  var cobrandCurie = null;

  return {
    set: function(value) {
      cobrandCurie = value;
    },
    get: function() {
      return cobrandCurie;
    }
  };
}).
controller('AppCtrl', ['$scope', 'cobrandCurie', function ($scope, cobrandCurie) {
  $scope.sessionModel = {
    username: null,
    curie: null,
    displayName: null,
    teamCurie: null, 
    authToken: null
  };

  $scope.logout = function() {
    $scope.sessionModel.username = null;
    $scope.sessionModel.curie = null;
    $scope.sessionModel.displayName = null;
    $scope.sessionModel.teamCurie = null;
    $scope.sessionModel.authToken = null;
  };

  // cobrandCurie.set($scope.cobrandModel.displayName);

  /*
  var recvName = function (data) {
    $scope.name = data.name;
  };
  socket.addListener('send:name', recvName);

  $scope.$on('$destroy', function() {
    socket.removeListener('send:name', recvName);
  });
  */
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
    $scope.$parent.sessionModel.curie = 'users:aaaa';
    $scope.$parent.sessionModel.displayName = 'Display Name';
    $scope.$parent.sessionModel.teamCurie = null;
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
    $scope.$parent.sessionModel.curie = 'users:abcd',
    $scope.$parent.sessionModel.displayName = 'Display Name';
    $scope.$parent.sessionModel.teamCurie = 'teams:1234';
    $scope.$parent.sessionModel.authToken = 'Blahblahblah';

    $location.path('/studentLobby');
  }
}]);

angular.bootstrap(document, ['irally']);
