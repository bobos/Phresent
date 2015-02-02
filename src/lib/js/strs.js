// These are message names shared by both server and browser
(function(exports){
 
  // channels
  exports.presenterChannel = function(){
    return '/PresenterChannel';
  };

  exports.audienceChannel = function(){
    return '/AudienceChannel';
  };

  // text shown on page
  exports.noQuestion = function(){
    return 'No question has been raised up yet!';
  };

  exports.getAllQuestions = function(){
    return 'Get all questions';
  };

  // messages from/to audience, let's keep them short
  exports.loadSlide = function(){
    return '1';
  };

  exports.connect = function(){
    return '2';
  };

  exports.submitQuestion = function(){
    return '3';
  };

  exports.noMorePages = function(){
    return '4';
  };

  exports.voteOption = function(){
    return '5';
  };

  exports.vote = function(){
    return '6';
  };

  exports.showVotes = function(){
    return '7';
  };

  exports.comment = function(){
    return '8';
  };

  exports.loadAgenda = function(){
    return '9';
  };

  exports.currentPageNum = function(){
    return '10';
  };

  // messages for presenter channel
  exports.connectedNum = function(){
    return 'update connected audience number';
  };

  exports.initVote = function(){
    return 'initiate a vote';
  };

  exports.endVote = function(){
    return 'end a vote';
  };

  exports.setQesNum = function(){
    return 'set number of open questions on presentation page';
  };

  exports.removeQuestion = function(){
    return 'remove current question from question stack';
  };

  exports.showQuestion = function(){
    return 'show question on presentation page';
  };

  exports.showQuestionS = function(){
    return 'show question on presentation page by Server';
  };

  exports.toggleArrow = function(){
    return 'toggle arrow buttons on page';
  };

  exports.showArrows = function(){
    return 'show both left and rigth arrows on page';
  };

  exports.showLArrow = function(){
    return 'show left arrow on page';
  };

  exports.showRArrow = function(){
    return 'show right arrow on page';
  };

  exports.showNArrow = function(){
    return 'show arrow on page';
  };

  exports.elapseTime = function(){
    return 'update elapsed time';
  };

  exports.askDuration = function(){
    return 'ask presentation duration';
  };

  exports.setDuration = function(){
    return 'set presentation duration';
  };

  exports.showComment = function(){
    return 'show comment on presentation page';
  };

  exports.plusOne = function(){
    return 'plus one on topic';
  };

  exports.minusOne = function(){
    return 'minus one on topic';
  };

  exports.currentFavourites = function(){
    return 'current favourites';
  };

  exports.getAllVotes = function(){
    return 'Get All Votes';
  };

  exports.endVoteS = function(){
    return 'Close Vote Window Asked by Server';
  };

  exports.openQesDia = function(){
    return 'open question dialog';
  };

  exports.openQesDiaS = function(){
    return 'open question dialog asked by Server';
  };

  exports.closeQesDia = function(){
    return 'close question dialog';
  };

  exports.closeQesDiaS = function(){
    return 'close question dialog asked by Server';
  };

  exports.customEvent = function(){
    return 'custom event from custom slides';
  };

}(typeof exports === 'undefined' ? this.strs = {} : exports));
