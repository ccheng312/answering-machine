const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

let users = {}

app.use(express.static('public'));

io.on('connection', function(socket) {
  socket.on('enter', user => io.emit('enter', user));
  socket.on('chat message', (user, msg) => {
    io.emit('chat message', user, msg);
    users[user] = socket.id;
  });
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

