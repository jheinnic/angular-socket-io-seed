/*
 * Serve content over a socket
 */

module.exports = function (io, cobrandConfig) {
  var connections = { }

  io.sockets.on('connection', function(socket) {
    console.log('Connect handler invoked for ' + socket.id + ' and cobrand ' + cobrandConfig.displayName);

    // TODO: Turn this into the auth() method, and add an emit for the user himself/herself.
    socket.on('user:ready', function(data) {
      console.log('user:ready')
      console.log(data)

      socket.cobrandCurie = cobrandConfig.curie;
      socket.siteChannel = '/' + cobrandConfig.curie.replace(':','/');
      socket.join(socket.siteChannel)

      if (data.teamCurie) {
        socket.ready = false
        socket.readyTeamMembers = []
        socket.teamMembers = [data.curie];
        socket.invitePending = [];

        socket.teamCurie = data.teamCurie;
        socket.teamChannel = '/' + data.teamCurie.replace(':','/')
        socket.join(socket.teamChannel)
        multicastToTeam('team:ready', data, false);
      } else {
        socket.ready = false
        socket.readyTeamMembers = []
        socket.teamMembers = [];
        socket.invitePending = [];

        socket.teamCurie = null;
        socket.teamChannel = null;
      }
  
      // Compare these with credentials cached in the persistent session and then copied to socket attributes
      // during session authentication instead of just trusting input from the user.
      socket.displayName = data.displayName;
      socket.selfCurie = data.curie;
      socket.join('/' + socket.selfCurie.replace(':', '/'))
      multicastToCobrand('user:ready', data, false);
    });
  
    socket.on('message:send', function(data) {
      console.log('message:send')
      console.log(data)
  
      // Extract and remove out-of-band recipient data.
      var recipientChannel = '/' + data.recipientCurie.replace(':','/');
      var serverTime = new Date();

      // Populate session and environment info that we'll display (sender display name and current time)
      data.clientTimestamp = data.timestamp;
      data.timestamp = serverTime.getTime();
      data.displayName = socket.displyName;
      data.senderCurie = socket.selfCurie;

      // Route as appropriate!
      console.log('I am ' + socket.cobrandCurie + ', receiving for ' + data.recipientCurie);
      if (data.recipientCurie == cobrandConfig.curie) {
        delete data.recipientCurie;
        multicastToCobrand('lobby:message', data, true);
      } else if (data.recipientCurie == socket.teamCurie) {
        delete data.recipientCurie;
        multicastToTeam('team:message', data, true);
      } else if (data.recipientCurie.slice(0,6) == "users:") {
        unicastToUser(recipientChannel, 'users:message', data, true);
      } else {
        console.log('ERROR: Unknown recipient curie: ' + data.recipientCurie);
      }
    });
    
    function multicastToCobrand(message, data, echo)
    {
      // remove socket.emit if you don't want the sender to receive their own message //
      if (echo) {
        socket.emit(message, data);
      }
      socket.broadcast.to(socket.siteChannel).emit(message, data);
    }
    
    function multicastToTeam(message, data, echo)
    {
      // remove socket.emit if you don't want the sender to receive their own message //
      if (echo) {
        socket.emit(message, data);
      }
      socket.broadcast.to(socket.teamChannel).emit(message, data);
    }
    
    function unicastToUser(recipientCurie, message, data, echo)
    {
      // remove socket.emit if you don't want the sender to receive their own message //
      if (echo) {
        socket.emit(message, data);
      }

      var recipientChannel = '/' + recipientCurie.replace(':','/');
      socket.broadcast.to(recipientChannel).emit(message, data);
    }
  
    function dispatchStatus()
    {
      multicastToCobrand('lobby:status', connections, false);
    }
    
    // handle connections & disconnections //
    connections[socket.id] = {};
    dispatchStatus();
  
    socket.on('disconnect', function() {
      delete connections[socket.id]; dispatchStatus();
      multicastToCobrand('user:disconnected', { name : socket.name });
    });
  });
};
