const socket = io();
let username = null;

function appendMessage(msg) {
  $('#messages').append($('<li>').text(msg));
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

  socket.on('enter', user => appendMessage(user + ' has entered the chat.'));
  socket.on('chat message', (user, msg) => appendMessage(user + ': ' + msg));
}

$(function() {
  main();
});
