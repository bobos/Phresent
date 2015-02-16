var fs = require('fs')
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var strs = require('./lib/js/strs.js');

var pageNumber = 1;

var questions = new Array();
var votes;
var votedAddress = new Array();
var questionCounter = 0;
var connected = new Array();
var duration = 0;
var slides = 0;
var agenda;
var timer = 0;
var favourites = {};
var voteEnded = false;

var presenterChannel = io.of(strs.presenterChannel());
var askSlide = strs.loadSlide();

// prepare agenda data
(function(){
  try {
    agenda = JSON.parse(fs.readFileSync('agenda/agenda.json', 'utf-8')); 
    var time = agenda['duration'].split(":");
    duration = parseInt(time[0]) * 3600 + parseInt(time[1]) * 60 + parseInt(time[2]);
    slides = parseInt(agenda['slides']);
  } catch (err) {
    console.error(err);
  }
}());

// *********************************************************
// help functions
// *********************************************************
function setTimer(){
  setTimeout(function(){
    timer += 5;
    presenterChannel.emit(strs.elapseTime(), timer)
    setTimer();
  }, 5000);
}

function load_slide(pageNum, isPresenter, socket) {
  if (pageNum <= slides && pageNum > 0) {
    fs.readFile('slides/' + pageNum.toString() + '.html', 'utf-8', function(err, data) {
      // toggle arrow buttons on audience's slide page
      if (isPresenter) {
        audienceChannel.emit(strs.currentPageNum(), pageNum);
        audienceChannel.emit(strs.currentFavourites(), favourites);
        pageNumber = pageNum;
      }
      else {
        socket.emit(strs.toggleArrow(), toggleArrowMsg(pageNum-1, slides-1));
      }
      socket.emit(askSlide, data);
    });
  }
  else {
    socket.emit(strs.noMorePages());
  }
}

function sentQuestion(num) {
  var len = questions.length;
  if(len == 0) {
    // empty question dialog
    presenterChannel.emit(strs.toggleArrow(), strs.showNArrow());
    presenterChannel.emit(strs.showQuestionS(), strs.noQuestion());
  }
  else {
    questionCounter += num;
    presenterChannel.emit(strs.showQuestionS(), questions[questionCounter]);
    presenterChannel.emit(strs.toggleArrow(), toggleArrowMsg(questionCounter, len-1));
  }
}

function toggleArrowMsg(currentPos, lastPos) {
  if(lastPos == 0) {
    return strs.showNArrow();
  }
  if(currentPos == 0) {
    return strs.showRArrow();
  }
  if(currentPos < lastPos) {
    return strs.showArrows()
  }
  return strs.showLArrow();
}

// *********************************************************
// routing
// *********************************************************
app.get('/ffee1cca7862e99487a93dbc70634af0af288d5f', function(req, res){
  res.sendFile(__dirname + '/phresent.html');
  if (timer == 0) {
    setTimer();
  }
});

app.get('/vote', function(req, res){
  res.sendFile(__dirname + '/vote.html');
});

app.get('/', function(req, res){
  res.sendFile(__dirname + '/audience.html');
});

// images, js, css etc.  
app.get('/lib/*', function(req, res){
  res.sendFile(__dirname + '/lib/' + req.params[0]);
});

// images, js, css etc for slides.  
app.get('/slides/*', function(req, res){
  res.sendFile(__dirname + '/slides/' + req.params[0]);
});

var audienceChannel = io.of(strs.audienceChannel());
// ********************************************************
//  presenter channel
// ********************************************************
presenterChannel.on('connection', function(socket){
  // slides handling
  socket.on(askSlide, function(incr) {
    load_slide(pageNumber + incr, true, presenterChannel);
    presenterChannel.emit(strs.setQesNum(), questions.length);
    });

  // question handling
  socket.on(strs.submitQuestion(), function(question) {
    questions.push(question);
    console.log(question);
    presenterChannel.emit(strs.setQesNum(), questions.length);
    });

  socket.on(strs.openQesDia(), function() {
    presenterChannel.emit(strs.openQesDiaS());
  });

  socket.on(strs.closeQesDia(), function() {
    presenterChannel.emit(strs.closeQesDiaS());
  });

  socket.on(strs.removeQuestion(), function() {
    var len = questions.length - 1;
    if(len == 0) {
      questions.pop();
      questionCounter = 0;
    }
    else if(questionCounter == len) {
      questions.pop();
      questionCounter -= 1;
    }
    else{
      questions.splice(questionCounter, 1);
    }
    presenterChannel.emit(strs.setQesNum(), questions.length);
    // update question dialog 
    sentQuestion(0);
  });

  socket.on(strs.showQuestion(), sentQuestion);

  socket.on(strs.getAllQuestions(), function() {
    presenterChannel.emit(strs.getAllQuestions(), questions);
  });

  // voting handling
  socket.on(strs.initVote(), function(candidates) {
    votedAddress = new Array();
    votes = {};
    candidates.split('\n').forEach(function(option){
      votes[option] = 0;
    });
    presenterChannel.emit(strs.showVotes(), votes);
    console.log(votes);
  });

  socket.on(strs.endVote(), function() {
    voteEnded = true;
    audienceChannel.emit(strs.endVote());
    presenterChannel.emit(strs.endVoteS());
  });

  socket.on(strs.getAllVotes(), function() {
    presenterChannel.emit(strs.getAllVotes(), votes);
  });

  // status bar
  socket.on(strs.askDuration(), function(){
      socket.emit(strs.setDuration(), duration);
  });

  // custom event sent from custom slides, just broadcast it
  socket.on(strs.customEvent(), function(passOn){
      presenterChannel.emit(strs.customEvent(), passOn);
  });


});

// ********************************************************
// audience channel
// ********************************************************
audienceChannel.on('connection', function(socket){
  // load slide request from audience
  socket.on(askSlide, function(num) {
    load_slide(num, false, socket)
    });

  socket.on(strs.vote(), function(vote) {
  var address = socket.handshake.address;
    if (votedAddress.indexOf(address) == -1) {
      votes[vote] += 1;
      votedAddress.push(address);
    }
    presenterChannel.emit(strs.showVotes(), votes);
  });

  socket.on(strs.voteOption(), function() {
    if (!voteEnded) {
      socket.emit(strs.voteOption(), votes);
    }
  });

  socket.on(strs.comment(), function(comment) {
    presenterChannel.emit(strs.showComment(), comment);
  });

  socket.on(strs.connect(), function() {
    console.log('Connected');
    var address = socket.handshake.address
    if (connected.indexOf(address) == -1) {
      connected.push(address);
    }
    presenterChannel.emit(strs.connectedNum(), connected.length);
  });

  socket.on(strs.loadAgenda(), function() {
    socket.emit(strs.loadAgenda(), JSON.stringify(agenda));
  });

  socket.on(strs.currentPageNum(), function() {
    socket.emit(strs.currentPageNum(), pageNumber);
  });

  socket.on(strs.plusOne(), function(topic){
    console.log('Hi!');
    var address = socket.handshake.address;
    if (topic in favourites) {
      if (favourites[topic].indexOf(address) == -1) {
        favourites[topic].push(address);
      }
    }
    else {
      favourites[topic] = [address];
    }
    console.log(favourites);

  });

  socket.on(strs.minusOne(), function(topic){
    var address = socket.handshake.address;
    if (topic in favourites) {
      var id = favourites[topic].indexOf(address);
      if (id != -1) {
        favourites[topic].splice(id, 1);
      }
    }
    console.log(favourites);

  });

  socket.on(strs.currentFavourites(), function() {
    console.log('Update favourites');
    socket.emit(strs.currentFavourites(), favourites);
  });

  socket.on(strs.personalFavourites(), function() {
    console.log('Personal favourites');
    personal_favourites = new Array();
    var address = socket.handshake.address;
    for (topic in favourites) {
      var id = favourites[topic].indexOf(address);
      if (id != -1) {
        personal_favourites.push(topic);
      }
    }
    socket.emit(strs.personalFavourites(), personal_favourites);
  });


});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
