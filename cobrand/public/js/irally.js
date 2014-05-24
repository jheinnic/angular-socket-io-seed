'use strict';

var CLIENT_SESSION_COOKIE_NAME = 'iRallyClientSession';

// Declare app level module which depends on application sub-modules and 3rd-party dependencies
angular.module('irally', [
  'ngCookies', 'ngRoute', 'ir.navbar', 'ir.lobby'
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
controller('AppCtrl', ['$scope', '$cookieStore', function ($scope, $cookieStore) {
  var sessionCookie = $cookieStore.get(CLIENT_SESSION_COOKIE_NAME);
  if (sessionCookie) {
    $scope.sessionModel = sessionCookie;
  } else {
    $scope.sessionModel = {
      username: null,
      curie: null,
      displayName: null,
      teamCurie: null, 
      authToken: null
    };
  }

  $scope.logout = function() {
    $scope.sessionModel.username = null;
    $scope.sessionModel.curie = null;
    $scope.sessionModel.displayName = null;
    $scope.sessionModel.teamCurie = null;
    $scope.sessionModel.authToken = null;

    $cookieStore.remove(CLIENT_SESSION_COOKIE_NAME);
  };

  $scope.onLogin = function(username, curie, displayName, teamCurie, authToken) {
    $scope.sessionModel.username = username;
    $scope.sessionModel.curie = curie;
    $scope.sessionModel.displayName = displayName;
    $scope.sessionModel.teamCurie = teamCurie;
    $scope.sessionModel.authToken = authToken;

    $cookieStore.put(CLIENT_SESSION_COOKIE_NAME, $scope.sessionModel);
  }
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
    // If API call to login service returns authentication credentials, populate the parent scope's
    // 'sessionModel' object, then cache 'sessionModel' in a client-only cookie.
    $scope.onLogin($scope.loginModel.email, 'users:aaaa', 'Display Name', null, 'Blahblahblah');

    // Next, go to the educator's initial page.
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
    // If API call to login service returns authentication credentials, populate the parent scope's
    // 'sessionModel' object, then cache 'sessionModel' in a client-only cookie.
    $scope.onLogin($scope.loginModel.email, 'users:abcd', 'Display Name', 'teams:1234', 'Blahblahblah');

    // Next, go to the player's initial page.
    $location.path('/studentLobby');
  }
}]);

angular.bootstrap(document, ['irally']);
