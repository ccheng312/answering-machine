const rooms = {};

// The maximum is exclusive and the minimum is inclusive.
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

class Room {
  constructor(admin, data = []) {
    this.admin = admin;
    this.data = new Map(data);
    this.disconnected = new Map();
    this.answer = null;
    this.finished = [];
  }

  addUser(user) {
    const score = this.disconnected.get(user);
    if (score) {
      this.data.set(user, score);
      this.disconnected.delete(user);
    } else {
      this.data.set(user, 0);
    }
  }

  removeUser(user) {
    this.disconnected.set(user, this.data.get(user));
    this.data.delete(user);
  }

  getAdmin() {
    return this.admin;
  }

  getScores() {
    const arr = Array.from(this.data);
    arr.sort((a, b) => b[1] - a[1]);
    return arr;
  }

  startRound(answer) {
    if (this.answer) {
      return false;
    }
    this.answer = answer;
    this.num_guessing = this.data.size;
    return true;
  }

  userFinished(user) {
    this.finished.push(user);
  }

  calculateScores() {
    const maxScore = 50 * this.num_guessing;
    return this.finished.map((user, index) => [user, maxScore - 50 * index]);
  }

  endRound() {
    if (!this.answer) {
      return false;
    }
    const scores = this.calculateScores();
    scores.forEach(pair => {
      const [user, score] = pair;
      if (this.data.has(user)) {
        const newScore = this.data.get(user) + score;
        this.data.set(user, newScore);
      } else if (this.disconnected.has(user)) {
        const newScore = this.disconnected.get(user) + score;
        this.disconnected.set(user, newScore);
      }
    });
    this.answer = null;
    this.finished = [];
    return scores;
  }
}

exports.listRooms = function() {
  return Object.keys(rooms);
}

exports.getRoom = function(roomId) {
  const id = roomId.toString();
  if (id in rooms) {
    return rooms[id];
  } else {
    return null;
  }
}

exports.createRoom = function(admin) {
  const id = getRandomInt(1000, 10000).toString();
  rooms[id] = new Room(admin);
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
rooms['1234'] = new Room('Chris');
