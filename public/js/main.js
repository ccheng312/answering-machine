const socket = io();
let username = null;
let room = null;

function appendMessage(msg, optionalClass) {
  let li = $('<li>').text(msg);
  if (optionalClass) {
    li.addClass(optionalClass);
  }
  $('#messages').append(li);
}

function updateScores(scores) {
  $('#scores').empty();
  for (const user in scores) {
    const user_span = $('<span>').text(user);
    const score = $('<span>').text(0);
    const li = $('<li>').attr('id', user).append(user_span).append(score);
    $('#scores').append(li);
  }
}

function main() {
  $('#name_form').submit(function(e) {
    username = $('#name_input').val();
    room = $('#room_input').val();
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

  socket.on('enter', (user) => appendMessage(user + ' has entered the chat.', 'announcement'));
  socket.on('chat message', (user, msg) => appendMessage(user + ': ' + msg));
  socket.on('exit', (user) => appendMessage(user + ' has left the chat.', 'announcement'));
  socket.on('scores', updateScores);
}

$(function() {
  main();
});
