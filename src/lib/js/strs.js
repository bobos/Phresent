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

  exports.setQesNum = function(){
    return 'set number of open questions on presentation page';
  };

  exports.removeQuestion = function(){
    return 'remove current question from question stack';
  };

  exports.showQuestion = function(){
    return 'show question on presentation page';
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

}(typeof exports === 'undefined' ? this.strs = {} : exports));
