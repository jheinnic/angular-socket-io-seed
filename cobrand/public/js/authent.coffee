  appModule =  angular.module 'ir-navbar', ['ng', 'mgcrea.ngStrap.navbar']

  appModule.directive 'irNavBar', [
    () ->
      restrict: 'E'
      replace: true
      templateUrl: 'js/partials/irNavbar.html'
  ]

  appModule.controller 'irNavCtrl', [
    '$scope'
    'irTabFactory'
    ($scope, irTabFactory) ->
      $scope.nbDataModel =
        brandName: 'iRally',
        brandLeft: true,
        initialActive: 'Home',
        leftTabModels: [
          # irTabFactory('Home', '/$', '/')
          # irTabFactory('Videos', '/videos$', '/videos')
        ],
        rightTabModels: [
          irTabFactory('Educator Login', '/login/educator$', '/login/educator')
          irTabFactory('Player Login', '/login/player$', '/login/player')
        ]
  ]

  appModule.factory 'irTabFactory', [
    () ->
      return (displayLabel, matchRoute, clickRoute) ->
        return new TabModel(displayLabel, matchRoute, clickRoute)
  ]

  class TabModel
    @::displayLabel = 'Index'
    @::matchRoute = '^/$'
    @::clickRoute = '/'

    constructor: (@displayLabel, @matchRoute, @clickRoute) -> return

    getMatchRoute: () ->
      if (angular.isString(@matchRoute) && @matchRoute > '')
        retVal = @matchRoute
      else
        retVal = @clickRoute + '$'
      return retVal

  return appModule
