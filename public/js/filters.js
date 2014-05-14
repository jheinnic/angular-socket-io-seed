'use strict';

/* Filters */

angular.module('irally.filters', ['irally.services']).
  filter('interpolate', ['version', function (version) {
    return function (text) {
      return String(text).replace(/\%VERSION\%/mg, version);
    }
  }]);
