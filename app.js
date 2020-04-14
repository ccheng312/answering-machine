const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);


/* Kinda like Python's defaultdict, but for JS*/
function defDict(type) {
    const dict = {};
    return {
        get: function (key) {
        if (!dict[key]) {
            dict[key] = type.constructor();
        }
        return dict[key];
        },
        dict: dict
    };
}
let rooms_to_scores = defDict({});

app.use('/scores/:room', function(req, res) {
  res.send(rooms_to_scores.get(req.params.room));
});
app.use(express.static('public'));

io.on('connection', function(socket) {
  socket.on('enter', (room, user) => {
    socket.join(room);
    rooms_to_scores.get(room)[user] = 0;
    io.emit('enter', user);
  });
  socket.on('chat message', (room, user, msg) => {
    io.to(room).emit('chat message', user, msg);
  });
  socket.on('disconnect', function() {
    // TODO: Broadcast disconnects.
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
