"use strict";

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

  var toolTipLowerBound = createRangeToolTip();

  $('#math-range-slider').noUiSlider({
    range: {
      'min': [ 10 ],
      '90%': [ 100 ],
      'max': [ 1000 ]
    },
    start: 30,
    step: 10,
    connect: 'lower',
    serialization: {
      lower: [ toolTipLowerBound ]
    }
  });


  if (!isMobile()) {
    $('#math-range-slider').change(function() {
      $('#question-answer').focus();
    });
  }
});

// enable tooltips
$(function() {
    $("[data-toggle=tooltip]").tooltip();
});