


var firstBackgroundUpdate = true;
var countdownStarted = false;
var countdownTimeoutId = -1;

var QUIZ_AVAILABLE_SECONDS = 5;
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

  // show evaluation tags
  $('#start-quiz').hide();
  $('#results').hide();
  $('#sharebuttons').hide();
}

function showEvaluationLayout() {

  // hide timing tags
  $('#questionbox').hide();
  $('#time-box').hide();

  // show evaluation tags
  $('#start-quiz').show();
  $('#results').show();
  $('#sharebuttons').show();
}

timeIsOver();
function timeIsOver() {

  showEvaluationLayout();

  // calculate score
  var sliderMax = parseInt($('#math-range-slider').val());
  var numOperatorsEnabled =  $('#div-operations :checkbox').size();
  var score = Math.ceil(numAnswersCorrect + sliderMax / 10 + numOperatorsEnabled);

  // TODO we should add a real ranking one day
  var ONE_BARELY_REACHES_THIS_SCORE = 50;
  var betterThanPercent = 100 * Math.min(Math.E * score / (ONE_BARELY_REACHES_THIS_SCORE * Math.PI), .99)

  var description = '' + 
  'You scored <span class="score">' + score+ '</span><br>' +
  'You are better than ' + betterThanPercent + ' %';
  $('#results .description').html(description);

}

// set up listeners
$(function() {
  var $question = $('#question');
  var $answer = $('#question-answer');
  var currentQuestion;
  var factory = new QuestionFactory();

  setFirstQuestion();
  function setFirstQuestion() {
    currentQuestion = factory.nextQuestion();
    $question.text(currentQuestion.getDisplay());
    $answer.val('');
  }

  function evaluateAnswer() {
    if (countdownTimeoutId === -1) {
      countdownTimeoutId = setInterval(updateTime, 1000);
    }

    numAnswersGiven++;

    if (currentQuestion !== undefined && currentQuestion.getAnswer() == $answer.val()) {
      numAnswersCorrect++;
    }

    currentQuestion = factory.nextQuestion();
    $question.text(currentQuestion.getDisplay());
    $answer.val('');
  }

  function isNumber(n) { 
    return !isNaN(parseFloat(n)) && isFinite(n);
  }

  function submitInputPressed(e) {
    if(e === undefined || e.which == 13) {
      if ($answer.val().trim() !== '' && isNumber($answer.val())) { 
        evaluateAnswer(); 
      }
      $answer.val('');
    }
  }

  // register answer submit listeners
  $answer.keypress(function(e) { 
    submitInputPressed(e);
  });

  $('#submit-answer').click(function() { 
    submitInputPressed();
    $answer.focus(); 
  });
});