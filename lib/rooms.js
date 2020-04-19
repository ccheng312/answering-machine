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
    this.reset();
  }

  addUser(user, score = 0) {
    this.data[user] = score;
  }

  removeUser(user) {
    delete this.data[user];
  }

  addScore(user, score) {
    this.data[user] += score;
  }

  getScores() {
    return this.data;
  }

  startGame(answers, time_per_answer) {
    if (this.activeGame) {
      return false;
    }
    this.activeGame = true;
    this.answers = answers;
    this.time_per_answer = time_per_answer;
  }

  nextAnswer() {
    if (!this.activeGame || this.activeRound || this.answers.length == 0) {
      return false;
    }
    this.answer = this.answers.pop();
    this.activeRound = true;
    this.timer = setTimeout(() => {
      this.activeRound = false;
    }, this.time_per_answer * 1000);
  }

  endRound() {
    if (!this.activeGame) {
      return false;
    }
    this.activeRound = false;
    clearTimeout(this.timer);
  }

  reset() {
    this.activeGame = false;
    this.answers = [];
    this.time_per_answer = 0;

    this.activeRound = false;
    if (this.timer) {
      clearTimeout(this.timer);
    }
    this.timer = null;
    this.answer = null;
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
