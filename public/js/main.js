let socket = null;
let username = null;
let roomId = null;

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

function initializeChat() {
  socket = io();
  socket.on('announce', msg => appendMessage(msg, 'announcement'));
  socket.on('chat message', (user, msg) => appendMessage(user + ': ' + msg));
  socket.on('scores', updateScores);

  $('#chat_form').submit(function(e) {
    e.preventDefault(); // prevents page reloading
    socket.emit('chat message', room, username, $('#m').val());
    $('#m').val('');
    return false;
  });
  $('#name_form_dialog').hide();
}

function main() {
  $('#name_form').submit(function(e) {
    username = $('#name_input').val();
    roomId = $('#room_input').val();
    $.post('/enter/' + roomId, { 'username': username },
           initializeChat);
    return false;
  });
}

$(function() {
  main();
});
