var fs = require('fs')
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var pageNumber = 1;

var questions = new Array();

app.get('/', function(req, res){
  res.sendFile(__dirname + '/phresent.html');
});

app.get('/audienceChannel', function(req, res){
  res.sendFile(__dirname + '/audience.html');
});

app.get('/question', function(req, res) {
    res.sendFile(__dirname + '/question.html');
});

// images, js, css etc.  
app.get('/lib/*', function(req, res){
  res.sendFile(__dirname + '/lib/' + req.params[0]);
});

var askSlide = 'load slide'
function load_slide(pageNum, isPresenter, socket) {
  fs.readFile('slides/' + pageNum + '.html', 'utf-8', function(err, data) {
      var msg = data;
      if (err) { msg = 'THE END'; }
      if (!err && isPresenter) { pageNumber = parseInt(pageNum); }
      socket.emit(askSlide, msg);
  });
}

/*
 * presenter channel
 */
var presenterChannel = io.of('/presenterChannel');
presenterChannel.on('connection', function(socket){
  // load slide request from presenter
  socket.on(askSlide, function(incr) {
    load_slide(pageNumber + parseInt(incr), true, socket);
    });
});

/*
 * audience channel
 */
var audienceChannel = io.of('/audienceChannel');
audienceChannel.on('connection', function(socket){
// load slide request from audience
  socket.on(askSlide, function(num) {
    load_slide(parseInt(num), false, socket)
    });
});

/*
 * audience channel
 */
var questionChannel = io.of('/questionChannel');
questionChannel.on('connection', function(socket){
    socket.on('ask question', function(question) {
        questions.push(question);
        console.log(question);
        socket.emit('change question number', questions.length);
    });
});


http.listen(3000, function(){
  console.log('listening on *:3000');
});
