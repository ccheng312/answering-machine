const rooms = {};

// The maximum is exclusive and the minimum is inclusive.
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

function strMapToObj(strMap) {
  let obj = Object.create(null);
  for (let [k,v] of strMap) {
    obj[k] = v;
  }
  return obj;
}

class Room {
  constructor(data = []) {
    this.data = new Map(data);
    this.answer = null;
    this.finished = [];
  }

  addUser(user, score = 0) {
    this.data.set(user, score);
  }

  removeUser(user) {
    this.data.delete(user);
  }

  hasUser(user) {
    return this.data.has(user);
  }

  getScores() {
    return strMapToObj(this.data);
  }

  startRound(answer) {
    if (this.answer) {
      return false;
    }
    this.answer = answer;
    return true;
  }

  userFinished(user) {
    this.finished.push(user);
  }

  calculateScores() {
    const maxScore = 50 * this.data.size;
    return this.finished.map((user, index) => [user, maxScore - 50 * index]);
  }

  endRound() {
    if (!this.answer) {
      return false;
    }
    const scores = this.calculateScores();
    scores.forEach(pair => {
      const [user, score] = pair;
      const newScore = this.data.get(user) + score;
      this.data.set(user, newScore);
    });
    this.answer = null;
    this.finished = [];
    return scores;
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
