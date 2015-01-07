var fs = require('fs');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.get('/lib/img/previous.png', function(req, res) {
    var img = fs.readFileSync('lib/img/previous.png');
    res.writeHead(200, {'Content-ype': 'image/gif'});
    res.end(img, 'binary');
});


app.get('/lib/img/next.png', function(req, res) {
    var img = fs.readFileSync('lib/img/next.png');
    res.writeHead(200, {'Content-ype': 'image/gif'});
    res.end(img, 'binary');
});
io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });

    socket.on('load page', function(pagename) {
        fs.readFile('slides/' + pagename.toString() + '.html', 'utf-8', function(err, data) {
            if (err) {
                console.log(err);
                io.emit('load page', 'NOT EXIST');
            }
            else {
                console.log(data);
                io.emit('load page', data);
            }
        });
    });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
