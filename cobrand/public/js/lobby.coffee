appModule =  angular.module 'ir.lobby', ['ng', 'btford.socket-io']

appModule.directive 'irStudentLobby', [
  () ->
    restrict: 'E'
    replace: true
    scope: true
    controller: ['$scope', 'irLobbySocketFactory', ($scope, irLobbySocketFactory) ->
      $scope.userModels = [
        new LobbyUserModel('User One', 'users:1234', 'teams:1234', false),
        new LobbyUserModel('User Two', 'users:94db', null, false),
        new LobbyUserModel('User Three', 'users:0d9a', 'teams:abc2', false),
        new LobbyUserModel('Teacher', 'users:d63a', null, true),
        new LobbyUserModel('User Four', 'users:c4f1', 'teams:abc2', false),
        new LobbyUserModel('User Five', 'users:5fa1', 'teams:1234', false)
      ];

      # Selection and Mouseover Effects
      $scope.teamModel = {
        selected: null,
        invitePending: null,
        teamMembers: [],
        readyTeamMembers: [],
        ready: false
      }

      $scope.selectUser = (lobbyUser) ->
        if ($scope.teamModel.selected != null)
          $scope.teamModel.selected.isSelected = false
          $scope.teamModel.selected = null;

        if (lobbyUser.isTeacher || (($scope.teamModel.invitePending == null) && (lobbyUser.isFreeAgent())) || lobbyUser.hasMyTeam($scope.sessionModel.teamCurie))
          $scope.teamModel.selected = lobbyUser
          lobbyUser.isSelected = true

      $scope.getDecorationClass = (lobbyUser) ->
        retVal = ''
        if (lobbyUser.isSelected) 
          retVal = 'active'
        else
          if (lobbyUser.hasMouse)
            if (lobbyUser.isTeacher)
              retVal = 'list-group-info'
            else
              if (lobbyUser.isFreeAgent())
                if ($scope.teamModel.invitePending != null)
                  retVal = 'list-group-warning'
                else
                  retVal = 'list-group-success'
              else
                if(lobbyUser.hasMyTeam())
                  retVal = 'list-group-info'
                else
                  retVal = 'list-group-error'
        retVal

      # Websocket Logic

      $scope.messageModels = [ ]
      $scope.newMessageModel = { content: null }

      recvMessage = (data) ->
        $scope.messageModels.push(
          JSON.parse(data)
        );
      recvStatus = (data) ->
        console.log('Status Update: ' + JSON.stringify(data));
      recvNewUser = (data) ->
        console.log('New User: ' + JSON.stringify(data));
      socket = irLobbySocketFactory($scope.cobrandModel.curie);

      # TODO: Make sure message content is HTML sanitized!!!
      $scope.sendMessage = () ->
        socket.emit('user-message', {
          senderCurie: $scope.sessionModel.curie
          senderDisplayName: $scope.sessionModel.displayName
          messageText: $scope.newMessageModel.content
          timestamp: new Date().getValue()
        })

      socket.addListener 'status', recvStatus
      socket.addListener 'user-ready', recvNewUser
      socket.addListener 'user-message', recvMessage

      $scope.$on('$destroy', () ->
        socket.removeListener 'user-message', recvMessage
        socket.removeListener 'user-ready', recvNewUser
        socket.removeListener 'status', recvStatus;
        socket.close
      )

      socket.emit('user-ready', {
        displayName: $scope.sessionModel.displayName,
        curie: $scope.sessionModel.curie
      })
    ],

    templateUrl: 'partials/irStudentLobby'
]


appModule.factory('irLobbySocketFactory', ['socketFactory', (socketFactory) ->
  (curie) ->
    # TODO: Don't hard-code a specific cobrand curie...  Get it from the static injection!
    myIoSocket = io.connect '/' + curie;
  
    mySocket = socketFactory({
      ioSocket: myIoSocket
    })
  
    mySocket
]);

appModule.factory 'irStudentLobbyFactory', [
  () ->
    return (displayName, curie, teamCurie, isTeacher) ->
      return new LobbyUserModel(displayName, curie, teamCurie, isTeacher)
]
class LobbyUserModel
  @::displayName = 'StudentName'
  @::curie = 'users:92a0'
  @::teamCurie = 'teams:ae4d'
  @::isTeacher = false
  @::hasMouse = false
  @::isSelected = false
  @::hasInvitePending = false

  constructor: (@displayName, @curie, @teamCurie, @isTeacher) -> return

  isFreeAgent: () ->
    @curie == null

  hasMyTeam: (myTeamCurie) ->
    myTeamCurie != null && myTeamCurie == @curie

  hasOtherTeam: (myTeamCurie) ->
    @curie != null && myTeamCurie != @curie

appModule
