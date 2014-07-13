

var QuestionAdapter = function() {

  this.getLowerBound = function() { return parseInt($('#math-range-slider').val()[0]); }
  this.getUpperBound = function() { return parseInt($('#math-range-slider').val()[1]); }

  function isCheckBoxOfValueChecked(val) {
    return $('input[type="checkbox"][value="' + val + '"]').is(":checked");
  }

  this.allowAdd = function() { return isCheckBoxOfValueChecked('add'); }
  this.allowSub = function() { return isCheckBoxOfValueChecked('sub'); }
  this.allowMul = function() { return isCheckBoxOfValueChecked('mul'); }
  this.allowDiv = function() { return isCheckBoxOfValueChecked('div'); }
  this.allowPow = function() { return isCheckBoxOfValueChecked('pow'); }
}

// @param display representation of the question that is displayed
// @param internal representation used internally. It can be evaluated using 'eval'
var Question = function(internal) {
  this.internal = internal;
  var display = internal .replace('/', '÷')
                         .replace('*', '×')
                         .replace('^2', '²')
                         .replace('^3', '³');

  // replace ^ by Math.pow such that eval() will work as expected
  if (internal.indexOf('^') !== -1) {
    var split = internal.split('^');
    internal = "Math.pow({0}, {1})".format(split[0], split[1]);
  }

  this.getAnswer = function() {
    return eval(internal);
  }

  this.getDisplay = function() {
    return display;
  }
}

var QuestionFactory = function() {
  this.adapter = new QuestionAdapter();
  
  var rand = getRandomInt;

  function binaryFactory(a, b, operator) {
    return "{0} {1} {2}".format(parseInt(rand(a, b)), operator, parseInt(rand(a, b)));
  }

  function addFactory(a, b) {
    return binaryFactory(a, b, '+');
  }

  function subFactory(a, b) {
    return binaryFactory(a, b, '-');
  }

  function mulFactory(a, b) {
    return binaryFactory(a, b, '*');
  }

  function divFactory(a, b) {
    // we ensure the result be integer
    // 1 + to avoid getting 0 and thence 0 / 0
    var x1 = 1 + rand(Math.floor(Math.sqrt(a)), Math.ceil(Math.sqrt(2*b)));
    var x2 = 1 + rand(Math.floor(Math.sqrt(a)), Math.ceil(Math.sqrt(2*b)));
    var y = x1 * x2;

    if (y > b)
      return divFactory(a, b);

    return "{0} {1} {2}".format(y, '/', x1);
  }

  function powFactory(a, b) {
    var base = rand(2, Math.min(b, 21));
    var exp = rand(2, 3);
    return "{0}{1}{2}".format(base, '^', exp);
  }

  this.nextQuestion = function() {
    var factories = [];
    // add factories as requested
    if (this.adapter.allowAdd())
      factories.push(addFactory);
    if (this.adapter.allowSub())
      factories.push(subFactory);
    if (this.adapter.allowMul())
      factories.push(mulFactory);
    if (this.adapter.allowDiv())
      factories.push(divFactory);
    if (this.adapter.allowPow())
      factories.push(powFactory);

    // select random factory and apply it to the range (a, b)
    var randFactory = factories[Math.floor(Math.random() * factories.length)];
    var internal = randFactory(this.adapter.getLowerBound(), this.adapter.getUpperBound());
    return new Question(internal);
  }

}