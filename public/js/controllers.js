'use strict';

/* Controllers */

angular.module('irally.controllers', ['irally.services']).
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
