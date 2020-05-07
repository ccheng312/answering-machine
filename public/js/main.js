let username = null;
let roomId = null;

function appendMessage(msg, optionalClass) {
  const li = $('<li>').text(msg);
  if (optionalClass) {
    li.addClass(optionalClass);
  }
  $('#messages').append(li);
  $('#messages li').get(-1).scrollIntoView();
}

function updateScores(scores) {
  $('#scores').empty();
  for (const pair of scores) {
    const [user, score] = pair;
    const user_td = $('<td>').text(user);
    const score_td = $('<td>').text(score);
    const tr = $('<tr>').attr('id', user).append(user_td).append(score_td);
    $('#scores').append(tr);
  }
}

const initializeChat = roomId => admin_data => {
  const socket = io();
  socket.on('message', appendMessage);
  socket.on('scores', updateScores);

  $('#chat_form').submit(() => {
    let msg = $('#m').val();
    if (msg) {
      socket.emit('chat message', msg);
    }
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
        .fail(showLoginError);
        return false;
    } else if (action === 'create') {
      $.post('/create', { 'username': username })
        .done(initializeChat(roomId))
        .fail(showLoginError);
    }
  });
}

function showLoginError(err) {
  if (err.responseJSON.error) {
    $('#login_error').addClass('invalid').text(err.responseJSON.error);
  } else {
    console.log(err);
  }
}

$(function() {
  main();
});
