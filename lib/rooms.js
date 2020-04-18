const rooms = {};

// The maximum is exclusive and the minimum is inclusive.
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

class Room {
  constructor(data = {}) {
    this.data = data;
  }

  addUser(user, score = 0) {
    this.data[user] = score;
  }

  deleteUser(user) {
    delete this.data[user];
  }

  getScores() {
    return this.data;
  }
}

exports.getRoom = function(roomId) {
  const id = roomId.toString();
  if (id in rooms) {
    return rooms[id];
  } else {
    return null;
  }
}

exports.createRoom = function() {
  const id = getRandomInt(1000, 10000).toString();
  rooms[id] = new Room();
  return id;
}

exports.deleteRoom = function(roomId) {
  const id = roomId.toString();
  if (id in rooms) {
    return delete rooms[id];
  } else {
    return false;
  }
}

// Create room 1234 for convenience while in development.
rooms['1234'] = new Room();
