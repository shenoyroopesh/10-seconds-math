


var firstBackgroundUpdate = true;
var countdownStarted = false;
var countdownTimeoutId = -1;

var QUIZ_AVAILABLE_SECONDS = 5;
var quizStartTime = QUIZ_AVAILABLE_SECONDS;


var numAnswersCorrect = 0;
var numAnswersGiven = 0;


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


timeIsOver();
function timeIsOver() {
  // bonuses
  function allOperatorsIncluded() {
    var numChecked = $('#div-operations :checked').size();
    var numAll = $('#div-operations :checkbox').size();

    return numAll === numChecked;
  }

  // true if the percent of corrently answered questions is 
  // larger than the bound parameter.
  // bound should be between 0 and 1
  function overPercentCorrect(bound) {
    var percentReached = numAnswersCorrect / numAnswersGiven;

    return bound >= percentReached;
  }


    $('#questionbox').hide();
    $('#time-box').hide();

    $('#start-quiz').show();
    $('#results').show();
    $('#sharebuttons').show();


    var $bonusList = $('#bonus-list');
    var cumulativeScore = numAnswersCorrect;
    var score = 0;

    // var maxIndex = 0;

    // for (; maxIndex < bonuses.length; maxIndex++) {
    //   var bonus = bonuses[maxIndex];
    //   if (bonus.predicate()) {
    //     score += bonus.points;

        var $bonusTag = $('<tr><td>+' + 5 + '</td><td>' + 'awezom' + '</td></tr>').hide();
        $bonusList.append($bonusTag);

    //     setTimeout(function() { 
    //       $bonusTag.show('slow');
    //     }, 1000 * (maxIndex + 1));
    //   }
    // };

    // summary
    // var summaryDelay = 1000 * (maxIndex + 2);
    // setTimeout(function() {
      $separator = $('<tr class="separator"><td></td><td></td></tr>').hide();
      $score = $('<tr class="summary"><td>' + score + '</td><td>score</td></tr>').hide();
      $bonusList.append($separator).append($score);
      $separator.show('slow'); $score.show('slow');
    // }, summaryDelay);

    // var facebookDelay = 1000 * (maxIndex + 3);
    // setTimeout(function() {
      $('#stats .sharefb').fadeIn();
    // }, facebookDelay);

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