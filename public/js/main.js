const socket = io();
let username = null;
let room = 1234;  // Hardcoded for now.
let scores = {};

function appendMessage(msg, optionalClass) {
  let li = $('<li>').text(msg);
  if (optionalClass) {
    li.addClass(optionalClass);
  }
  $('#messages').append(li);
}

function userEnter(user) {
  appendMessage(user + ' has entered the chat.', 'announcement');
  const user_span = $('<span>').text(user);
  const score = $('<span>').text(0);
  const li = $('<li>').attr('id', user).append(user_span).append(score);
  $('#scores').append(li);
  scores[user] = 0;
}

function userExit(user) {
  appendMessage(user + ' has left the chat.', 'announcement');
  $('#scores #' + user).remove();
  scores[user] = null;
}

function main() {
  $('#name_form').submit(function(e) {
    username = $('#name_input').val();
    socket.emit('enter', room, username);
    $('#name_form_dialog').hide();
    return false;
  });
  $('#chat_form').submit(function(e) {
    e.preventDefault(); // prevents page reloading
    socket.emit('chat message', room, username, $('#m').val());
    $('#m').val('');
    return false;
  });

  socket.on('enter', userEnter);
  socket.on('chat message', (user, msg) => appendMessage(user + ': ' + msg));
  socket.on('exit', userExit);
}

$(function() {
  main();
});
