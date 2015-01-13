var fs = require('fs')
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var pageNumber = 1;

var questions = new Array();
var votes;
var votedAddress = new Array();
var questionCounter = 0;

app.get('/', function(req, res){
  res.sendFile(__dirname + '/phresent.html');
});

app.get('/vote', function(req, res){
  res.sendFile(__dirname + '/vote.html');
});

app.get('/audienceChannel', function(req, res){
  res.sendFile(__dirname + '/audience.html');
});

// images, js, css etc.  
app.get('/lib/*', function(req, res){
  res.sendFile(__dirname + '/lib/' + req.params[0]);
});

var askSlide = 'load slide'
function load_slide(pageNum, isPresenter, socket) {
  fs.readFile('slides/' + pageNum.toString() + '.html', 'utf-8', function(err, data) {
      var msg = data;
      if (err) { msg = 'THE END'; }
      if (!err && isPresenter) { pageNumber = pageNum; }
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
    load_slide(pageNumber + incr, true, presenterChannel);
    });
 
  socket.on('load presentation page', function() {
    load_slide(pageNumber, true, presenterChannel);
    presenterChannel.emit('change question number', 
                          questions.length);
    });

  socket.on('ask question', function(question) {
    questions.push(question);
    console.log(question);
    presenterChannel.emit('change question number', 
                          questions.length);
    });

  socket.on('create votes', function(candidates) {
    votes = {};
    candidates.split('\n').forEach(function(option){
      votes[option] = 0;
    });
    presenterChannel.emit('show votes', votes);
    console.log(votes);
  });

  socket.on('load questions', function(type) {
    if (type == 'LOAD') {
      console.log('send out question!');
    }
    else if (type == 'NEXT') {
      if (questionCounter < questions.length -1 ) {
        questionCounter += 1;
      }
    }
    else if (type == 'PREVIOUS') {
      if (questionCounter > 0 ) {
        questionCounter -= 1;
      }
    }
    console.log(questionCounter);
    presenterChannel.emit('show questions', questions[questionCounter]);
  });

  
});

/*
 * audience channel
 */
var audienceChannel = io.of('/audienceChannel');
audienceChannel.on('connection', function(socket){
// load slide request from audience
  socket.on(askSlide, function(num) {
    load_slide(num, false, socket)
    });

  socket.on('ask votes', function() {
    socket.emit('ask votes', votes);
  });

  socket.on('vote', function(vote) {
  var address = socket.handshake.address;
    if (votedAddress.indexOf(address) == -1) {
      votes[vote] += 1;
      votedAddress.push(address);
    }
    console.log(votes);
    presenterChannel.emit('show votes', votes);
  });

  socket.on('show votes', function() {
    presenterChannel.emit('show votes', votes);
  });

});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
