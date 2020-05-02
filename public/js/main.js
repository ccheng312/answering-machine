let username = null;
let roomId = null;

function appendMessage(msg, optionalClass) {
  const li = $('<li>').text(msg);
  if (optionalClass) {
    li.addClass(optionalClass);
  }
  $('#messages').append(li);
}

function updateScores(scores) {
  $('#scores').empty();
  for (const user in scores) {
    const user_span = $('<span>').text(user);
    const score = $('<span>').text(scores[user]);
    const li = $('<li>').attr('id', user).append(user_span).append(score);
    $('#scores').append(li);
  }
}

function initializeChat() {
  const socket = io();
  socket.on('message', appendMessage);
  socket.on('scores', updateScores);

  $('#chat_form').submit(() => {
    socket.emit('chat message', $('#m').val());
    $('#m').val('');
    return false;
  });
  $('#admin_form').submit(() => {
    socket.emit('start round', $('#answer_input').val());
    $('#answer_input').val('');
    return false;
  });
  $('button.admin-end').click(() => {
    socket.emit('end round');
  });
  $('#name_form_dialog').hide();
}

function main() {
  $('#name_form').submit(function(e) {
    username = $('#name_input').val();
    roomId = $('#room_input').val();
    $.post('/enter/' + roomId, { 'username': username })
      .done(initializeChat)
      .fail(err => console.log(err.responseJSON));
    return false;
  });
}

$(function() {
  main();
});
