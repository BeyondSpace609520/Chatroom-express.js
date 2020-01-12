var socket = io();

$(document).ready(function () {	
	socket.emit('newRegister', user);
});
