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

app.get('/api/slides/first', function(req, res) {
    fs.readFile('slides/1.html', 'utf-8', function(err, data) {
            if (err) {
                res.writeHead(200, {"Content-Type": "text/html"});
                res.write("OPPPPS");
                res.end();
            }
            else {
                console.log(data);
                res.writeHead(200, {"Content-Type": "text/html"});
                res.write(data);
                res.end();
            }
        });

});
io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });

    socket.on('load next page', function(pagename) {
        fs.readFile('slides/' + pagename.toString() + '.html', 'utf-8', function(err, data) {
            if (err) {
                io.emit('load next page', 'NOT EXIST');
            }
            else {
                console.log(data);
                io.emit('load next page', data);
            }
        });
    });

    socket.on('load previous page', function(pagename) {
        fs.readFile('slides/' + pagename.toString() + '.html', 'utf-8', function(err, data) {
            if (err) {
                io.emit('load previous page', 'NOT EXIST');
            }
            else {
                console.log(data);
                io.emit('load previous page', data);
            }
        });
    });

});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
