const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const rooms_lib = require('./lib/rooms');

app.set('view engine', 'pug');

// Routes
app.get('/', function(req, res) {
  res.render('index');
});

app.post('/rooms', function(req, res) {
  const roomId = rooms_lib.createRoom();
  res.send({'roomId': roomId});
});

app.get('/room/:roomId', function(req, res) {
  res.send(rooms_lib.getRoom(req.params.roomId));
});

app.delete('/room/:roomId', function(req, res) {
  res.send(rooms_lib.deleteRoom(roomId));
});

app.use(express.static('public'));

// Business logic
function emitScores(roomId) {
  const room = rooms_lib.getRoom(roomId);
  io.to(roomId).emit('scores', room.getScores());
}

io.on('connection', function(socket) {
  socket.on('enter', (roomId, user) => {
    const room = rooms_lib.getRoom(roomId);
    if (room == null) {
      // error handling
      console.log('No room: %s', roomId);
    } else {
      socket.join(roomId);
      room.addUser(user);
      io.emit('enter', user);
      emitScores(roomId);
    }
  });
  socket.on('chat message', (roomId, user, msg) => {
    io.to(roomId).emit('chat message', user, msg);
  });
  socket.on('disconnect', function() {
    // TODO: Broadcast disconnects.
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
