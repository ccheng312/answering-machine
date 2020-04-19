const rooms_lib = require('./lib/rooms');
const session = require('express-session')({
  secret: 'answering machine',
  resave: false,
  saveUninitialized: false
});

// Express
const express = require('express');
const app = express();

app.set('view engine', 'pug');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(session);

// Routes
app.get('/', function(req, res) {
  res.render('index', { username: req.session.username || ''});
});

app.post('/enter/:roomId', function(req, res) {
  req.session.username = req.body.username;
  req.session.roomId = req.params.roomId;
  res.sendStatus(200);
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

// Server
const server = require('http').createServer(app);
server.listen(3000, () => console.log('listening on *:3000'));

// Socket.IO
const io = require('socket.io')(server);

io.use((socket, next) => session(socket.request, socket.request.res || {}, next));

io.on('connection', function(socket) {
  const username = socket.request.session.username;
  const roomId = socket.request.session.roomId;
  const room = rooms_lib.getRoom(roomId);
  if (room == null) {
    // error handling
    console.log('No room: %s', roomId);
  } else {
    socket.join(roomId);
    room.addUser(username);
    io.to(roomId).emit('announce', username + ' has entered the chat.');
    io.to(roomId).emit('scores', room.getScores());
  }

  socket.on('chat message', (roomId, user, msg) => {
    io.to(roomId).emit('chat message', user, msg);
  });
  socket.on('disconnect', function() {
    room.removeUser(username);
    io.to(roomId).emit('announce', username + ' has left the chat.');
    io.to(roomId).emit('scores', room.getScores());
  });
});
