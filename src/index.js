var fs = require('fs')
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var pageNumber = 1;

var questions = new Array();

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.get('/question', function(req, res) {
    res.sendFile(__dirname + '/question.html');
});

// images, js, css etc.  
app.get('/lib/*', function(req, res){
  res.sendFile(__dirname + '/lib/' + req.params[0]);
});

app.get('/api/slides/first', function(req, res) {
    fs.readFile('slides/' + pageNumber + '.html', 'utf-8', function(err, data) {
            if (err) {
                res.writeHead(200, {"Content-Type": "text/html"});
                res.write("OOOOPS");
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
        fs.readFile('slides/' + (pageNumber + 1).toString() + '.html', 'utf-8', function(err, data) {
            if (err) {
                io.emit('load next page', 'NOT EXIST');
            }
            else {
                console.log(data);
                io.emit('load next page', data);
                pageNumber += 1;
                console.log(pageNumber);
            }
        });
    });

    socket.on('load previous page', function(pagename) {
        fs.readFile('slides/' + (pageNumber - 1).toString() + '.html', 'utf-8', function(err, data) {
            if (err) {
                io.emit('load previous page', 'NOT EXIST');
            }
            else {
                console.log(data);
                io.emit('load previous page', data);
                pageNumber -= 1;
                console.log(pageNumber);
            }
        });
    });

    socket.on('ask question', function(question) {
        questions.push(question);
        console.log(question);
        io.emit('change question number', questions.length);
    });

});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
