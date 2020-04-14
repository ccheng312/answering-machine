const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

let users = {}

app.use(express.static('public'));

io.on('connection', function(socket) {
  socket.on('enter', (room, user) => {
    socket.join(room);
    io.emit('enter', user);
  });
  socket.on('chat message', (room, user, msg) => {
    io.to(room).emit('chat message', user, msg);
    users[socket.id] = user;
  });
  socket.on('disconnect', function() {
    io.emit('exit', users[socket.id]);
    users[socket.id] = null;
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
