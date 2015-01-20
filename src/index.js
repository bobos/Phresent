var fs = require('fs')
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var pageNumber = 1;

var questions = new Array();
var votes;
var votedAddress = new Array();
var questionCounter = 0;
var connected = new Array();
var timer = 0;
var agenda = {};

var presenterChannel = io.of('/presenterChannel');
var audienceChannel = io.of('/audienceChannel');

function setTimer(){
  setTimeout(function(){
    timer += 1;
    presenterChannel.emit('update elapsed time', timer)
    setTimer();
  }, 1000);
}

app.get('/ffee1cca7862e99487a93dbc70634af0af288d5f', function(req, res){
  res.sendFile(__dirname + '/phresent.html');
  if (timer == 0) {
    setTimer();
  }
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
      audienceChannel.emit('update agenda', pageNum);
  });
}

/*
 * presenter channel
 */
presenterChannel.on('connection', function(socket){
  // load slide request from presenter
  socket.on(askSlide, function(incr) {
    load_slide(pageNumber + incr, true, presenterChannel);
    });
 
  socket.on('load presentation page', function() {
    load_slide(pageNumber, true, presenterChannel);
//    presenterChannel.emit('change question number', 
//                          questions.length);
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

  socket.on('total time', function(){
    fs.readFile('agenda/agenda', 'utf-8', function(err, data) {
      var msg = data;
      if (err) { msg = 'THE END'; }
      if (!err) { msg = JSON.parse(data); }
      var time = msg['duration'].split(":");
      console.log(data);
      console.log(time);
      var sec = parseInt(time[0]) * 3600 + parseInt(time[1]) * 60 + parseInt(time[2]);
      console.log(sec);
      socket.emit('update total time', sec);
    });

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
    else if (type == 'REMOVE') {
      if (questionCounter == questions.length - 1) {
        questions.pop();
        questionCounter -= 1;
      }
      else {
        questions.splice(questionCounter, 1);
        console.log("splice the questions");
      }
      presenterChannel.emit('change question number', 
                          questions.length)
    }
    console.log(questionCounter);
    console.log(questions);
    if (questions.length == 0) {
      presenterChannel.emit('show questions', "QUESTION END");
    }
    else {
      presenterChannel.emit('show questions', questions[questionCounter]);
    }
  });

  
});

/*
 * audience channel
 */
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

  socket.on('submit comment', function(comment) {
    console.log('Get comment');
    presenterChannel.emit('show comments', comment);
  });

  socket.on('connected', function() {
    var address = socket.handshake.address
    if (connected.indexOf(address) == -1) {
      connected.push(address);
    }
    presenterChannel.emit('update connected number', connected.length);
  });

  function isEmptyObject( obj ) {
    for ( var name in obj ) {
        return false;
    }
    return true;
  }

  socket.on('load agenda', function() {
      fs.readFile('agenda/agenda', 'utf-8', function(err, data) {
        var msg = data;
        if (err) { msg = 'OPPPPS'; }
        if (!err) { msg = JSON.parse(data); }
        console.log(msg);
        agenda = msg;
        console.log(agenda);
        response = JSON.stringify(agenda)
        socket.emit('load agenda', response);

    });

  });

  socket.on('update agenda', function() {
    socket.emit('update agenda', pageNumber);
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
