
// set background height according to screen size
$(function() {

  var footerHeight = 55;

  if (isMobile()) {
    footerHeight = 35;
  }

  var padd = $(window).height() - $('body').height() - footerHeight;
  $('#questionbox').css({'padding-bottom': padd + 'px'});
});

 // On document ready, initialize noUiSlider.
$(function(){

  var formatToolTipContent = function(value) {
    return '<span>' + Math.floor(value) + '</span>';
  }

  var createRangeToolTip = function() {
    return $.Link({
      target: '-tooltip-<div class="tooltip"></div>',
      method: function ( value ) {

        // The tooltip HTML is 'this', so additional
        // markup can be inserted here.
        $(this).html(formatToolTipContent(value));
      }
    });
  }

  var toolTipLowerBound = (function() {
    return $.Link({
      target: '-tooltip-<div class="tooltip"></div>',
      method: function ( value ) {

        // hide lower tooltip
        $(this).parent().hide();
      }
    });
  })();


  var toolTipUpperBound = createRangeToolTip();

  $('#math-range-slider').noUiSlider({
    range: {
      'min': [ 10 ],
      '90%': [ 100 ],
      'max': [ 1000 ]
    },
    start: [ 0, 30 ],
    step: 10,
    connect: true,
    serialization: {
      lower: [ toolTipLowerBound ],
      upper: [ toolTipUpperBound ]
    }
  });


  if (!isMobile()) {
    $('#math-range-slider').change(function() {
      $('#question-answer').focus();
    });
  }

});