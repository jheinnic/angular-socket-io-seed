'use strict';

/* Directives */

angular.module('irally.directives', ['irally.services']).
  directive('appVersion', ['version', function (version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    };
  }]);
