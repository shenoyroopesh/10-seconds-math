

var QuestionAdapter = function() {

  this.getUpperBound = function() { return parseInt($('#math-range-slider').val()); }

  function isCheckBoxOfValueChecked(val) {
    return $('input[type="checkbox"][value="' + val + '"]').is(":checked");
  }

  this.allowAdd = function() { return isCheckBoxOfValueChecked('add'); }
  this.allowSub = function() { return isCheckBoxOfValueChecked('sub'); }
  this.allowMul = function() { return isCheckBoxOfValueChecked('mul'); }
  this.allowDiv = function() { return isCheckBoxOfValueChecked('div'); }
  this.allowPow = function() { return isCheckBoxOfValueChecked('pow'); }
  this.allowSqrt = function() { return isCheckBoxOfValueChecked('sqrt'); }
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

  // replace √ (sqrt unicode) in internal
  if (internal[0] === '√') {
    internal = "Math.sqrt({0})".format(internal.substr(1));
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
    b = b / Math.log(b);
    return binaryFactory(a, b, '*');
  }

  function divFactory(a, b) {
    // we ensure the result be integer
    // 1 + to avoid getting 0 and thence 0 / 0
    var x1 = 1 + rand(Math.floor(Math.sqrt(a)), Math.ceil(Math.sqrt(2*b)));
    var x2 = 1 + rand(Math.floor(Math.sqrt(a)), Math.ceil(Math.sqrt(2*b)));
    var y = x1 * x2;

    if (y > b)
      return divFactory(a, b * 2);

    return "{0} {1} {2}".format(y, '/', x1);
  }

  function powFactory(a, b) {
    var base = rand(2, Math.min(b, 21));
    var exp = 2; //rand(2, 3);
    return "{0}{1}{2}".format(base, '^', exp);
  }

  function sqrtFactory(a, b) {
    var perfectSquares = [0, 1, 4, 9, 16, 25, 36, 49, 64, 81, 100, 121, 144, 169, 196, 225, 256, 289, 324, 361, 400, 441, 484, 529, 576, 625, 676, 729, 784, 841, 900, 961, 1024];
    var maxIndex = perfectSquares.length - 1;
    while (perfectSquares[maxIndex] > b) {
      maxIndex--;
    }

    return "√" + perfectSquares[rand(0, maxIndex + 1)];
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
    if (this.adapter.allowSqrt())
      factories.push(sqrtFactory);

    // select random factory and apply it to the range (a, b)
    var randFactory = factories[Math.floor(Math.random() * factories.length)];
    var internal = randFactory(0, this.adapter.getUpperBound());
    return new Question(internal);
  }

}