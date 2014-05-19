/*
 * Serve content over a socket
 */

module.exports = function (socket) {
  var channelInit = function(socket) {
    socket.emit('send:name', {
      name: 'Bob'
    });
  
    setInterval(function () {
      socket.emit('send:time', {
        time: (new Date()).toString()
      });
    }, 1000);
  };

  socket.of('/root-nobrand-socket').on('connection', channelInit);
};
