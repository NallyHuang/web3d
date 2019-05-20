var express = require('express'),
	app = express(),
	server = require('http').createServer(app),
	io = require('socket.io').listen(server),
	nicknames = [];

server.listen(3000);

hw05.get('/', function(req, res){
	res.sendfile(__dirname + '/index.html');
});
hw05.use('/public', express.static(__dirname + '/public'));
hw05.use('point.mp3', express.static(__dirname + '/point.mp3'));


io.sockets.on('connection', function(socket) {
	socket.on('new user', function(data){
		console.log(data);
		if (nicknames.indexOf(data) != -1) {

		} else {
			socket.emit('chat', 'SERVER', 'Hello! ' + data);

			socket.nickname = data;
			nicknames.push(socket.nickname);
			io.sockets.emit('usernames', nicknames);
			updateNicknames();
		}
	});

	function updateNicknames(){
		io.sockets.emit('usernames', nicknames);
	}

	//
	socket.on('send message', function(data){
		io.sockets.emit('new message', { msg: data, nick: socket.nickname });
	});

	socket.on('disconnect', function(data){
		if (!socket.nickname) return;
		io.sockets.emit('chat', 'SERVER', socket.nickname + ' leave');
		nicknames.splice(nicknames.indexOf(socket.nickname), 1);
		updateNicknames();
	});
});