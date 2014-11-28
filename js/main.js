"use strict";

var firstBackgroundUpdate = true;
var countdownStarted = false;
var countdownTimeoutId = -1;

var QUIZ_AVAILABLE_SECONDS = 10;
var quizStartTime = QUIZ_AVAILABLE_SECONDS;


var numAnswersCorrect = 0;
var numAnswersGiven = 0;



function resetState() {
  numAnswersGiven = numAnswersCorrect = 0;
  countdownTimeoutId = -1;
  countdownStarted = false;
}


$(function() {
  $('#repeat-box').click(function() {
    // reset vars

    $(this).hide();
  });
});

function updateTime() {
  quizStartTime--;

  if (quizStartTime < 0) {
    // reset vars
    clearInterval(countdownTimeoutId);
    countdownTimeoutId = -1;
    quizStartTime = QUIZ_AVAILABLE_SECONDS;


    timeIsOver();

    return;
  } 

  // update timer
  var progressPercent = (QUIZ_AVAILABLE_SECONDS - quizStartTime) / QUIZ_AVAILABLE_SECONDS * 100;
  $('#time-left').html(quizStartTime);
  $('#time-left-indicator').animate({'width': progressPercent + '%'}, 300);
}


$('#start-quiz').click(function() {
  resetState();
  showStartLayout();

});

function showStartLayout() {
  // hide timing tags
  $('#questionbox').show();
  $('#time-box').show();
  $('.flashbox').show()

  // show evaluation tags
  $('#start-quiz').hide();
  $('#results').hide();
  $('#sharebuttons').hide();

  $('#question-answer').focus();
}

function showEvaluationLayout() {
  // hide timing tags
  $('#questionbox').hide();
  $('#time-box').hide();
  $('.flashbox').hide();

  // show evaluation tags
  $('#start-quiz').css({'display': 'inline-block'});
  $('#results').show();
  $('#sharebuttons').show();

  $('#time-left').text(QUIZ_AVAILABLE_SECONDS);
  $('#time-left-indicator').css({'width': '0%'});

  
}

$(document).keypress(function(e) {
  if(e.which == 13 && $('#start-quiz').is(':visible')) {
    $('#start-quiz a').click();
  }
});

// make sure always at least one checkbox is checked
$('#div-operations :checkbox').change(function(e){
  if (!$(this).is(':checked')) {
    if ($("#div-operations :checkbox:checked").length === 0) {
      $(this).prop('checked', true);
    }
  }
});

// timeIsOver();
function timeIsOver() {
  showEvaluationLayout();
  var score = calculateScore();
  setEvaluation(score, getRank(score));

  updateTwitterButton();
  // facebook does update itself



  // function definitions follow //

  function updateTwitterButton() {
    var twitterButtons = $('.twitter-share-button');
    if (twitterButtons.size() !== 0) {
      $('#sharebuttons .twitter-share-button').remove();
      // Generate new markup
      var $tweetBtn = $('<a></a>')
          .addClass('twitter-share-button')
          .attr('href', 'http://twitter.com/share')
          .attr('data-url', 'http://mental-math-trainer.com')
          .attr('data-text', 'Check out my math score: ' + score + '! In just 10 seconds <3');
      $('.sharebutton').first().append($tweetBtn);
      twttr.widgets.load();
    }
  }

  function calculateScore() {
    var sliderMax = parseInt($('#math-range-slider').val());

    if (sliderMax > 100) {
      sliderMax = 100;
    }

    var numOperatorsEnabled =  $('#div-operations :checkbox').size();
    return Math.ceil(numAnswersCorrect * (sliderMax / 10 + numOperatorsEnabled));
  }

  function getRank(score) {
    // TODO we should add a real ranking one day

    var ONE_BARELY_REACHES_THIS_SCORE = 200;
    return Math.floor(100 * Math.min(Math.E * score / (ONE_BARELY_REACHES_THIS_SCORE * Math.PI), 1));
  }

  function setEvaluation(score, rank) {
    var description = 'You scored <span class="score">' + score + '</span>' +
                      'You are better than ' + rank + ' %';
    $('#results .description').html(description);
  }
}

// set up listeners
$(function() {
  var $question1 = $('#question1');
  var $question2 = $('#question2');
  var $question3 = $('#question3');
  var $question4 = $('#question4');

  $question1.click(compareWith1);
  $question2.click(compareWith2);
  $question3.click(compareWith3);
  $question4.click(compareWith4);

  var $answer = $('#answer');
  var currentQuestion1;
  var currentQuestion2;
  var currentQuestion3;
  var currentQuestion4;
  var factory = new QuestionFactory();

  setNewQuestion();

  // update question on slider or checkbox change
  $('#math-range-slider, #div-operations :checkbox').change(function(){
    setNewQuestion();
  });

  function compareWith1(){
    evaluateAnswer(currentQuestion1);
  }
  
  function compareWith2(){
    evaluateAnswer(currentQuestion2);
  }
    
  function compareWith3(){
    evaluateAnswer(currentQuestion3);
  }
  
  function compareWith4(){
    evaluateAnswer(currentQuestion4);
  }

  function setNewQuestion() {
    currentQuestion1 = factory.nextQuestion();
    currentQuestion2 = factory.nextQuestion();
    currentQuestion3 = factory.nextQuestion();
    currentQuestion4 = factory.nextQuestion();
    var questions = [currentQuestion1, currentQuestion2, currentQuestion3, currentQuestion4];
    $question1.text(currentQuestion1.getDisplay());
    $question2.text(currentQuestion2.getDisplay());
    $question3.text(currentQuestion3.getDisplay());
    $question4.text(currentQuestion4.getDisplay());

    $answer.text(questions[Math.floor(Math.random()*questions.length)].getAnswer())
  }

  function evaluateAnswer(question) {
    if (countdownTimeoutId === -1) {
      countdownTimeoutId = setInterval(updateTime, 1000);
    }

    numAnswersGiven++;

    if (question !== undefined && question.getAnswer() == $answer.text()) {
      numAnswersCorrect++;
      // _flashboxLeft.fire();
      quizStartTime += 2;
    } else {
      // _flashboxRight.fire();
    }

    setNewQuestion();
    $answer.val('');
  }

  function isNumber(n) { 
    return !isNaN(parseFloat(n)) && isFinite(n);
  }

/*
  function submitInputPressed(e) {
    if(e === undefined || e.which == 13) {
      if ($answer.val().trim() !== '' && isNumber($answer.val())) { 
        evaluateAnswer(); 
      }
      $answer.val('');
    }
  }

  // auto-submit correct answers
  $answer.keyup(function(e) {
     if ($answer.val() == currentQuestion.getAnswer()) {
        // $answer.trigger({type: 'keypress', which: 13, keyCode: 13});
        submitInputPressed();
      }
  });
*/

  // register answer submit listeners
  // $answer.keypress(function(e) { 
  //   submitInputPressed(e);
  // });

  // $('#submit-answer').click(function() { 
  //   submitInputPressed();
  //   $answer.focus(); 
  // });
});