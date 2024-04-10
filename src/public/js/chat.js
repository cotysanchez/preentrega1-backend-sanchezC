//Creamos una instancia de socket.io del lado del cliente ahora:
const socket = io();

//Creamos una variable para guardar el usuario:
let user;
const chatBox = document.getElementById('chatBox');


Swal.fire({
  title: 'Identificate',
  input: 'text',
  text: 'Ingresa un usuario para identificarte en el chat',
  inputValidator: (value) => {
    return !value && 'Necesitas escribir un nombre para continuar';
  },
  allowOutsideClick: false,
}).then((result) => {
  user = result.value;
});

chatBox.addEventListener('keyup', (event) => {
  if (event.key === 'Enter') {
    if (chatBox.value.trim().length > 0) {
      socket.emit('message', { user: user, message: chatBox.value });
      chatBox.value = '';
    }
  }
});

//Listener de Mensajes:

socket.on('message', (data) => {
  let log = document.getElementById('messagesLogs');
  let messages = '';

  data.forEach((message) => {
    messages = messages + `${message.user} dice: ${message.message} <br>`;
  });

  log.innerHTML = messages;
});
