const socket = io();
let username = null;
let scores = {};

function appendMessage(msg) {
  $('#messages').append($('<li>').text(msg));
}

function userEnter(user) {
  appendMessage(user + ' has entered the chat.');
  const score = $('<span>').text(0);
  const li = $('<li>').text(user + ':').attr('id', user).append(score);
  $('#scores').append(li);
  scores[user] = 0;
}

function userExit(user) {
  appendMessage(user + ' has left the chat.');
  $('#scores #' + user).remove();
  scores[user] = null;
}

function main() {
  $('#name_form').submit(function(e) {
    username = $('#name_input').val();
    socket.emit('enter', username);
    $('#name_form_dialog').hide();
    return false;
  });
  $('#chat_form').submit(function(e) {
    e.preventDefault(); // prevents page reloading
    socket.emit('chat message', username, $('#m').val());
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
