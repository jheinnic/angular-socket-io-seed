/*
 * Serve content over a socket
 */

module.exports = function (socket, cobrandConfig) {
  var channelInit = function(socket) {
    socket.on('user-ready', function(data) {
      // Compare these with credentials cached in the persistent session and then copied to socket attributes
      // during session authentication instead of just trusting input from the user.
      socket.displayName = data.displayName;
      socket.curie = data.curie;
      brodcastMessage('user-ready', data, false);
    });

    socket.on('user-message', function(data) {
      // socket.uName = data.name;
      // data.color = socket.color;
      data.clientTimestamp = data.timestamp;
      data.timestamp = new Date().getValue();
      data.readyName = socket.name;

      brodcastMessage('user-message', data, true);
    });

    function dispatchStatus()
    {
      brodcastMessage('status', connections);
    }
    
    function brodcastMessage(message, data, echo)
    {
      // remove socket.emit if you don't want the sender to receive their own message //
      if (echo) {
        socket.emit(message, data);
      }
      socket.broadcast.emit(message, data);
    }
    
    // handle connections & disconnections //
    connections[socket.id] = {};
    dispatchStatus();

    socket.on('disconnect', function() {
      delete connections[socket.id]; dispatchStatus();
      brodcastMessage('user-disconnected', { name : socket.name, color : socket.color });
    });
  };

  socket.of('/' + cobrandConfig.curie).on('connection', channelInit);
};
