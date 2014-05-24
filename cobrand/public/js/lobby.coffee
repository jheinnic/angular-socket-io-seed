appModule =  angular.module 'ir.lobby', ['ng', 'btford.socket-io', 'mgcrea.ngStrap.tab']

appModule.config(['$tabProvider', ($tabProvider) ->
  angular.extend($tabProvider.defaults, {
    template: '/partials/irLobbyMessageTab'
  })
])

appModule.directive 'irStudentLobby', [
  () ->
    restrict: 'E'
    replace: true
    scope: true,
    controller: ['$scope', ($scope) ->
      myCobrandCurie = $scope.cobrandModel.curie
      mySelfCurie = $scope.sessionModel.curie
      myTeamCurie = $scope.sessionModel.teamCurie

      $scope.userModels = [
        new LobbyUserModel('User One', 'users:1234', 'teams:1234', false),
        new LobbyUserModel('User Two', 'users:94db', null, false),
        new LobbyUserModel('User Three', 'users:0d9a', 'teams:abc2', false),
        new LobbyUserModel('Teacher', 'users:d63a', null, true),
        new LobbyUserModel('User Four', 'users:c4f1', 'teams:abc2', false),
        new LobbyUserModel('User Five', 'users:5fa1', 'teams:1234', false),
        new LobbyUserModel('User Six', 'users:ca66', null, false),
      ]

      # Book-keeping for team construction and race readiness
      $scope.controlStateModel = {
        selected: null,
        invitePending: null,
        teamMembers: [],
        readyTeamMembers: [],
        ready: false
      }

      # History of received messages
      $scope.messageModel = {
        activeTabIndex: 0
        tabLookup: { }
        tabDefinitions: [
          {
            title: 'Everyone'
            otherCurie: myCobrandCurie
            content: []
            contentList: []
            unreadCount: 0
          }
          {
            title: 'Team'
            otherCurie: myTeamCurie
            content: []
            contentList: []
            unreadCount: 0
          }
        ]
      }
      $scope.messageModel.tabLookup[myCobrandCurie] = 0
      $scope.messageModel.tabLookup[myTeamCurie] = 1

      # Container for typing a message to send
      $scope.newMessageModel = { content: null }

      $scope.selectUser = (lobbyUser) ->
        if ($scope.controlStateModel.selected != null)
          $scope.controlStateModel.selected.isSelected = false
          $scope.controlStateModel.selected = null

        if ((lobbyUser.isTeacher) || (($scope.controlStateModel.invitePending == null) && (lobbyUser.isFreeAgent())) || (lobbyUser.hasMyTeam(myTeamCurie)))
          $scope.controlStateModel.selected = lobbyUser
          lobbyUser.isSelected = true

      $scope.getMouseOverClass = (lobbyUser) ->
        retVal = ''
        if (lobbyUser.isSelected) 
          retVal = 'active'
        else
          if (lobbyUser.hasMouse)
            if ($scope.controlStateModel.invitePending == null) 
              retVal = $scope.pickByUserRelation(lobbyUser, [
                'list-group-item-info'
                'list-group-item-success'
                'list-group-item-info'
                'list-group-item-danger'
              ])
            else
              retVal = $scope.pickByUserRelation(lobbyUser, [
                'list-group-item-info'
                'list-group-item-warning'
                'list-group-item-info'
                'list-group-item-danger'
              ])
        retVal

      $scope.getGlyphIconClass = (lobbyUser) ->
        $scope.pickByUserRelation(lobbyUser, [
          'glyphicon-book'         # Teacher
          'glyphicon-user'         # Free Agent
          'glyphicon-flag'         # On same team
          'glyphicon-screenshot'   # Not on same team
        ])

      $scope.pickByUserRelation = (lobbyUser, retValArray) ->
        retVal = ''
        if (lobbyUser.isTeacher)
          retVal = retValArray[0]
        else
          if (lobbyUser.isFreeAgent())
            retVal = retValArray[1]
          else
            if(lobbyUser.hasMyTeam(myTeamCurie))
              retVal = retValArray[2]
            else
              retVal = retValArray[3]
        retVal

      #
      # Controller API for event source directive
      #

      this.recvLobbyMessage = (data) ->
        deliverMessage(data, 0)

      this.recvTeamMessage = (data) ->
        deliverMessage(data, 1)

      this.recvUserMessage = (data) ->
        # Identify whether sender or recipient is not the current user.
        if (data.senderCurie == mySelfCurie)
          otherCurie = data.recipientCurie
          otherName  = "Tab Must Already Exist!"
        else 
          otherCurie = data.senderCurie
          otherName  = data.senderDisplayName

        # Lookup the tab object for the other user, or create one if none
        # is found.
        deliverToIndex = $scope.messageModel.activeTabIndex
        if (deliverToIndex > 1)
          tabDefinition = $scope.messageModel.tabDefinitions[deliverToIndex]
        else
          tabDefinition = 
            title: '<span>' + otherName + '</span>'
            otherCurie: otherCurie
            contentList: []
            unreadCount: 0
          deliverToIndex = $scope.messageModel.tabDefinitions.length
          $scope.messageModel.tabLookup[otherCurie] = deliverToIndex
          $scope.messageModel.tabDefinitions[deliverToIndex] = tabDefinition
 
        # Append message data to that tab's content list.
        deliverMessage(data, deliverToIndex)
        if ($scope.messageModel.activeTabIndex != deliverToIndex)
          tabDefinition.unreadCount = tabDefinition.unreadCount + 1

      this.recvLobbyStatus = (data) ->
        console.log('Lobby status update: ' + JSON.stringify(data))

      this.recvTeamStatus = (data) ->
        console.log('Team status update: ' + JSON.stringify(data))
        $scope.controlStateModel.teamMembers = data.teamMembers
        $scope.controlStateModel.readyTeamMembers = data.readyTeamMembers
        $scope.controlStateModel.ready = data.ready

      this.recvUserStatus = (data) ->
        console.log('User status update: ' + JSON.stringify(data))

      this.recvUserOnline = (data) ->
        console.log('User has connected: ' + JSON.stringify(data))
      this.recvUserOffline = (data) ->
        console.log('User has disconnected: ' + JSON.stringify(data))

      this.recvInvited = (data) ->
        console.log('Received an invitation to join a team: ' + JSON.stringify(data))
      this.recvJoined = (data) ->
        console.log('Invited player accepted and has joined your team: ' + JSON.stringify(data))
      this.recvDeclined = (data) ->
        console.log('Invited player returned your invitation as declined: ' + JSON.stringify(data))

      #
      # Extensional customization of outbound Controller messages
      #
      $scope.allocateMessageTab = (otherCurie, otherName) ->
        deliverToIndex = $scope.messageModel.tabLookup[otherCurie]
        if (! deliverToIndex) 
          tabDefinition = 
            title: '<span>' + otherName + '</span>'
            otherCurie: otherCurie
            contentList: []
            unreadCount: 0
          deliverToIndex = $scope.messageModel.tabDefinitions.length
          $scope.messageModel.tabLookup[otherCurie] = deliverToIndex
          $scope.messageModel.tabDefinitions[deliverToIndex] = tabDefinition

        $scope.messageModel.activeTabIndex = deliverToIndex
        return

      $scope.sendMessage = angular.noop
      this.registerSendMessage = (sendMsgFunc) ->
        $scope.sendMessage = sendMsgFunc

      $scope.sendTeamInvite = angular.noop
      this.registerSendTeamInvite = (sendTeamInviteFunc) ->
        $scope.sendTeamInvite = sendTeamInviteFunc

      $scope.acceptInvitation = angular.noop
      this.registerAcceptInvitation = (acceptInvitationFunc) ->
        $scope.acceptInvitation = acceptInvitationFunc

      $scope.declineInvitation = angular.noop
      this.registerDeclineInvitation = (declineInvitationFunc) ->
        $scope.declineInvitation = declineInvitationFunc

      $scope.setReadyToRace = angular.noop
      this.registerSetReadyToRace = (setReadyToRaceFunc) ->
        $scope.setReadyToRace = setReadyToRaceFunc

      $scope.clearReadyToRace = angular.noop
      this.registerSetReadyToRace = (clearReadyToRaceFunc) ->
        $scope.clearReadyToRace = clearReadyToRaceFunc

      #
      # Non-extensional utility methods exposed by Controller
      #
      this.getNewMessageContent = () ->
        $scope.newMessageModel.content

      this.clearNewMessageContent = () ->
        $scope.newMessageModel.content = null

      deliverMessage = (data, deliverTabIndex) ->
        tabDefinition = $scope.messageModel.tabDefinitions[deliverTabIndex]
        tabDefinition.contentList.push(data)
        if ($scope.messageModel.activeTabIndex != deliverTabIndex)
          tabDefinition.unreadCount = tabDefinition.unreadCount + 1

      this
    ]

    templateUrl: 'partials/irStudentLobby'
]

appModule.directive('irSocketBased', ['socketFactory',
  (socketFactory) ->
    restrict: 'A'
    require: 'irStudentLobby'
    scope: true
    link: ($scope, $element, $attrs, lobbyCtrl) ->
      # console.log '/' + $scope.cobrandModel.curie
 
      onConnectHandler = () ->
        console.log('Connect Handler!')

        mySocket = socketFactory({
          ioSocket: myIoSocket
        })

        # TODO: Make sure message content is HTML sanitized!!!
        # TODO: Use the active tab to set the recipient: cobrand:<id>, team:<id>, or user:<id>
        lobbyCtrl.registerSendMessage () ->
          # TODO: Figure out how to get selections across the isolated scope boundary.  More likely, just stop
          #       using isolated scope here altogether.  Just defering the choice for now.
          # if ($scope.controlStateModel.selected)
          #   payload = 
          #     messageText: lobbyCtrl.getNewMessageContent()
          #     recipientCurie: $scope.controlStateModel.selected
          # else
          payload = 
            messageText: lobbyCtrl.getNewMessageContent()
            recipientCurie: $scope.messageModel.tabDefinitions[$scope.messageModel.activeTabIndex].otherCurie
          console.log 'Sending...'
          console.log $scope.messageModel.activeTabIndex
          console.log $scope.messageModel.tabLookup
          console.log payload
          mySocket.emit('message:send', payload)
          return

        lobbyCtrl.registerSendTeamInvite () ->
          payload = 
            senderCurie: $scope.sessionModel.curie
            senderDisplayName: $scope.sessionModel.displayName
            messageText: lobbyCtrl.getNewMessageContent()
            timestamp: new Date().getTime()
          console.log 'Sending...'
          console.log payload
  
          mySocket.emit('message:send', payload)
          return
  
  
        mySocket.addListener 'lobby:status', lobbyCtrl.recvLobbyStatus
        mySocket.addListener 'lobby:message', lobbyCtrl.recvLobbyMessage
        mySocket.addListener 'user:ready', lobbyCtrl.recvUserOnline
        mySocket.addListener 'user:disconnect', lobbyCtrl.recvUserOffline
        mySocket.addListener 'user:status', lobbyCtrl.recvUserStatus
        mySocket.addListener 'user:message', lobbyCtrl.recvUserMessage
        mySocket.addListener 'team:status', lobbyCtrl.recvTeamStatus
        mySocket.addListener 'team:message', lobbyCtrl.recvTeamMessage
        mySocket.addListener 'team:invited', lobbyCtrl.recvInvited
        mySocket.addListener 'team:joined', lobbyCtrl.recvJoined
        mySocket.addListener 'team:declined', lobbyCtrl.recvDeclined
  
        $scope.$on '$destroy', () ->
          mySocket.removeListener 'lobby:status', lobbyCtrl.recvLobbyStatus
          mySocket.removeListener 'lobby:message', lobbyCtrl.recvLobbyMessage
          mySocket.removeListener 'user:ready', lobbyCtrl.recvUserOnline
          mySocket.removeListener 'user:disconnect', lobbyCtrl.recvUserOffline
          mySocket.removeListener 'user:status', lobbyCtrl.recvUserStatus
          mySocket.removeListener 'user:message', lobbyCtrl.recvUserMessage
          mySocket.removeListener 'team:status', lobbyCtrl.recvTeamStatus
          mySocket.removeListener 'team:message', lobbyCtrl.recvTeamMessage
          mySocket.removeListener 'team:invited', lobbyCtrl.recvInvited
          mySocket.removeListener 'team:joined', lobbyCtrl.recvJoined
          mySocket.removeListener 'team:declined', lobbyCtrl.recvDeclined

          mySocket.close
          return
  
        mySocket.emit 'user:ready', 
          displayName: $scope.sessionModel.displayName,
          curie: $scope.sessionModel.curie

      # myIoSocket = io.connect 'http://uno.jchein.info:3000/' + $scope.cobrandModel.curie.replace(':', '')
      myIoSocket = io.connect '/'
      myIoSocket.on 'connect', onConnectHandler

      $element
])

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
    @teamCurie == null && !@isTeacher
  hasMyTeam: (myTeamCurie) ->
    (myTeamCurie != null) && (myTeamCurie == @teamCurie) && !@isTeacher
  hasOtherTeam: (myTeamCurie) ->
    (@teamCurie != null) && (myTeamCurie != @teamCurie) && !@isTeacher

appModule
