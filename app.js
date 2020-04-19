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
  const roomId = req.params.roomId;
  const username = req.body.username;
  const room = rooms_lib.getRoom(roomId);
  if (room == null) {
    res.status(404).send({ error: `Room '${roomId}' does not exist.`});
  } else if (username in room.getScores()) {
    res.status(400).send({ error: `Username '${username}' is taken.`});
  } else {
    req.session.username = username;
    req.session.roomId = roomId;
    res.sendStatus(200);
  }
});

app.post('/rooms', function(req, res) {
  const roomId = rooms_lib.createRoom();
  res.send({'roomId': roomId});
});

app.get('/rooms/:roomId', function(req, res) {
  res.send(rooms_lib.getRoom(req.params.roomId));
});

app.delete('/rooms/:roomId', function(req, res) {
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
  if (!username || !roomId) {
    return;
  }
  const room = rooms_lib.getRoom(roomId);
  socket.join(roomId);
  room.addUser(username);
  io.to(roomId).emit('message', `${username} has entered the chat.`, 'announcement');
  io.to(roomId).emit('scores', room.getScores());

  socket.on('chat message', msg => {
    io.to(roomId).emit('message', `${username}: ${msg}`);
  });
  socket.on('disconnect', function() {
    room.removeUser(username);
    io.to(roomId).emit('message', `${username} has left the chat.`, 'announcement');
    io.to(roomId).emit('scores', room.getScores());
  });
});
