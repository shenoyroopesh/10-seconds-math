


var firstBackgroundUpdate = true;

function updateBackgroundColor(score) {
  var positiveColors = [ 'f0f9da', 'e2f1b3', 'd3ea8d', 'c4e465', 'b5dd3b', 'a7d500', '98ce00', '91c400', '89bf00', '82b800', '7bb100', '74aa00'];
  var negativeColors = [ 'fff6de', 'ffedbe', 'ffe49c', 'ffda79', 'ffd155', 'ffc42d', 'ffbe00', 'ffb700', /* reds */ 'ff7876', 'ff423d', 'f32e28'];

  var color = 'eee';
  if (score > 0) {
    color = positiveColors[Math.min(score, positiveColors.length) - 1];
  } else if (score < 0) {
    color = negativeColors[Math.min(-score, negativeColors.length) - 1];
  }


  // console.log(score);
  $.cookie('score', score, { expires: 30 });

  if (firstBackgroundUpdate) {
    $('.onecolor').css({background: '#' + color});
    firstBackgroundUpdate = false;
  } else {
    $('.onecolor').animate({backgroundColor: '#' + color}, 'fast');
  }

}


// set up listeners
$(function() {
  var $question = $('#question');
  var $answer = $('#question-answer');
  var currentQuestion;
  var score = 1;
  var cookieScore = $.cookie('score');
  if (cookieScore !== undefined) {
    score += parseInt(cookieScore);
  }

  var factory = new QuestionFactory();

  // set first question
  evaluateAnswer();

  function evaluateAnswer() {
    if (currentQuestion !== undefined && currentQuestion.getAnswer() == $answer.val()) {
      score++;
      score = Math.min(score, 10);
    } else { 
      score--;
      score = Math.max(score, -10);
    }

    updateBackgroundColor(score);

    currentQuestion = factory.nextQuestion();
    $question.text(currentQuestion.getDisplay());
    $answer.val('');
  }

  $answer.keypress(function(e) { if(e.which == 13 && $answer.val().trim() !== '') { evaluateAnswer(); }});
  $('#submit-answer').click(function() { if ($answer.val().trim() !== '') { evaluateAnswer(); } $answer.focus(); });
});