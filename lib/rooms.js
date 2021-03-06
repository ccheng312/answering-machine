const rooms = {};

// The maximum is exclusive and the minimum is inclusive.
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

function normalizeAnswer(s) {
  return s.toLowerCase().match(/\S+/g);
}

function arraysEqual(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length != b.length) return false;

  for (let i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

class Room {
  constructor(admin, data = []) {
    this.admin = admin;
    this.data = new Map(data);
    this.disconnected = new Map();
    this.answer = null;
    this.finished = new Set();
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

  startRound(answer, user = null) {
    if (this.answer) {
      return false;
    }
    if (user && !this.data.has(user)) {
      return false;
    }
    const normalized = normalizeAnswer(answer);
    if (!normalized) {
      return false;
    }
    this.answer = normalized;
    this.clue_giver = user;
    if (user) {
      this.num_guessing = this.data.size - 2;
    } else {
      this.num_guessing = this.data.size - 1;
    }
    return true;
  }

  getAnswer() {
    return this.answer;
  }

  matchesAnswer(msg) {
    const answer = this.getAnswer();
    return answer && arraysEqual(normalizeAnswer(msg), answer);
  }

  userFinished(user) {
    if (user !== this.admin && user !== this.clue_giver) {
      this.finished.add(user);
    }
  }

  calculateScores() {
    const maxScore = 50 * this.num_guessing;
    const result = Array.from(this.finished).map(
      (user, index) => [user, maxScore - 50 * index]);
    if (this.clue_giver) {
      result.push([this.clue_giver, 50 * this.finished.size]);
    }
    return result;
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
    this.clue_giver = null;
    this.finished.clear();
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
  let id;
  do {
    id = getRandomInt(0, 10000).toString().padStart(4, '0');
  } while (id in rooms);
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
