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

const initializeChat = roomId => admin_data => {
  const socket = io();
  socket.on('message', appendMessage);
  socket.on('scores', updateScores);

  $('#chat_form').submit(() => {
    socket.emit('chat message', $('#m').val());
    $('#m').val('');
    return false;
  });
  if (admin_data) {
    $('.container').append(admin_data);
    $('#admin_form').submit(() => {
      socket.emit('start round', $('#answer_input').val());
      $('#answer_input').val('');
      return false;
    });
    $('button.admin-end').click(() => {
      socket.emit('end round');
    });
  }
  $('#name_form_dialog').hide();
}

function main() {
  $('#name_form').submit(e => {
    const action = $('#name_form').attr('action').toLowerCase();
    username = $('#name_input').val();

    if (action === 'enter') {
      roomId = $('#room_input').val();
      $.post('/enter/' + roomId, { 'username': username })
        .done(initializeChat(roomId))
        .fail(err => console.log(err.responseJSON));
        return false;
    } else if (action === 'create') {
      $.post('/create', { 'username': username })
        .done(initializeChat(roomId))
        .fail(err => console.log(err));
    }
  });
}

$(function() {
  main();
});
