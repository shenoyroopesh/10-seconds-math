


var firstBackgroundUpdate = true;
var countdownStarted = false;
var countdownTimeoutId = -1;

var QUIZ_AVAILABLE_SECONDS = 5;
var quizStartTime = QUIZ_AVAILABLE_SECONDS;


var correctAnswered = 0;
var numAnswersGiven = 0;


function updateTime() {
  quizStartTime--;

  if(quizStartTime < 0) {
    // reset vars
    clearInterval(countdownTimeoutId);
    quizStartTime = QUIZ_AVAILABLE_SECONDS;


    timeIsOver();

    $('#questionbox').fadeOut();
    $('#start-quiz').fadeIn();
    return;
  } 

  $('#time-left').html(quizStartTime + ' seconds left');
}

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
    var percentReached = correctAnswered / numAnswersGiven;

    return bound >= percentReached;
  }

  function over50PercentCorrect() { return overPercentCorrect(.5); }
  function over75PercentCorrect() { return overPercentCorrect(.75); }
  function over100PercentCorrect() { return overPercentCorrect(1); }


  $('#time-left').text('Time is over!');
  // animate score


  var enteredInner = false;
  $('#bonus-list *').children()
  .animate({paddingTop: "0px"}, 1000)
  .switchClass('large', '', 1000, 'swing', function() {

    if (enteredInner === false) {
      enteredInner = true;
    } else {
      return;
    }

    // A bonus item consists of 
    // predicate function, points worth, textual description
    var bonuses = [
      { 'predicate': allOperatorsIncluded, 'points': 10, 'text': 'all operators'},
      { 'predicate': over50PercentCorrect, 'points': 5, 'text': '> 50% correct'},
      { 'predicate': over75PercentCorrect, 'points': 10, 'text': '> 75% correct'},
      { 'predicate': over100PercentCorrect, 'points': 15, 'text': '> 100% correct'},
    ];

    var $bonusList = $('#bonus-list');
    var score = 0;
    var maxIndex = 0;

    for (; maxIndex < bonuses.length; maxIndex++) {
      var bonus = bonuses[maxIndex];
      if (bonus.predicate()) {
        score += bonus.points;

        var $bonusTag = $('<tr><td>+' + bonus.points + '</td><td>' + bonus.text + '</td></tr>').hide();
        $bonusList.append($bonusTag);

        setTimeout(function() { 
          $bonusTag.show('slow');
        }, 1000 * (maxIndex + 1));
      }
    };

    // summary
    var summaryDelay = 1000 * (maxIndex + 2);
    setTimeout(function() {
      $separator = $('<tr class="separator"><td></td><td></td></tr>').hide();
      $score = $('<tr class="summary"><td>' + score + '</td><td>score</td></tr>').hide();
      $bonusList.append($separator).append($score);
      $separator.show('slow'); $score.show('slow');
    }, summaryDelay);

    var facebookDelay = 1000 * (maxIndex + 3);
    setTimeout(function() {
      $('#stats .sharefb').show('slow');
    }, facebookDelay);
    
  });
}

// set up listeners
$(function() {
  var $question = $('#question');
  var $answer = $('#question-answer');
  var currentQuestion;


  var factory = new QuestionFactory();

  // set first question
  evaluateAnswer();

  function evaluateAnswer() {
    numAnswersGiven++;

    if (currentQuestion !== undefined && currentQuestion.getAnswer() == $answer.val()) {
      correctAnswered++;
    }

    currentQuestion = factory.nextQuestion();
    $question.text(currentQuestion.getDisplay());
    $answer.val('');
  }

  $answer.keypress(function(e) { if(e.which == 13 && $answer.val().trim() !== '') { evaluateAnswer(); }});
  $('#submit-answer').click(function() { if ($answer.val().trim() !== '') { evaluateAnswer(); } $answer.focus(); });
});