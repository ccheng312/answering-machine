const socket = io();
let username = null;

function enterChat(name) {
  username = name
  socket.emit('enter', name);
}

function appendMessage(msg) {
  $('#messages').append($('<li>').text(msg));
}

function main() {
  $('form').submit(function(e) {
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
