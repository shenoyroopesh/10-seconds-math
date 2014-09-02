

  // checkboxes
  var CHECK_BOX_VALUES = ['add', 'sub', 'mul', 'div', 'pow', 'sqrt'];

// read cookies
$(function() {

  // slider
  var a = $.cookie('lowerbound');
  var b = $.cookie('upperbound');

  if (a !== undefined && b !== undefined) {
    $('#math-range-slider').val([a, b]);
  }

  CHECK_BOX_VALUES.forEach(function(e) {
    var c = $.cookie(e);

    if (c !== undefined) {
      $('input[type="checkbox"][value="' + e + '"]').prop('checked', c !== 'false');
    }
  });

});


// register cookie listeners for writing
$(function() {
  $('#math-range-slider').change(function(a) {
    var bounds = $(a.target).val();
    $.cookie('lowerbound', bounds[0], { expires: 7 });
    $.cookie('upperbound', bounds[1], { expires: 7 });
  });

  function getCheckBoxFromValue(val) {
    return $('input[type="checkbox"][value="' + val + '"]');
  }

  function registerCheckBoxListenerByValue(val) {
    getCheckBoxFromValue(val).change(
      function() {
          $.cookie(val, $(this).is(':checked'), { expires: 7 });
      });
  }

  CHECK_BOX_VALUES.forEach(function(e) { 
    registerCheckBoxListenerByValue(e);
  });

});

// social buttons
$(function() {
  function showSocialButtons() {
    var html =
                '<div id="social-buttons" class="fadeable fade">'
            + '<div class="fb-like" data-href="http://www.mental-math-trainer.com" data-layout="box_count" data-width="50" ></div>'
            + '<div class="g-plusone-frame"><div class="g-plusone" data-size="tall" data-href="http://www.mental-math-trainer.com"></div></div>'
            + '<a href="https://twitter.com/share" class="twitter-share-button" data-url="http://www.mental-math-trainer.com" data-text="#1 online mental math trainer" data-count="vertical">Tweet</a>'
            + '<div id="fb-root"></div>'
            + '</div>';
    document.getElementById( 'viewport' ).insertAdjacentHTML( 'beforeEnd', html );

    var script = document.createElement( 'script' );
    script.async = true;
    script.src = document.location.protocol + '//connect.facebook.net/en_US/all.js#xfbml=1&appId=467518076718074';
    document.getElementById( 'fb-root' ).appendChild( script );

    script = document.createElement( 'script' );
    script.async = true;
    script.src = document.location.protocol + '//platform.twitter.com/widgets.js';
    document.getElementById( 'social-buttons' ).appendChild( script );

    script = document.createElement( 'script' );
    script.async = true;
    script.src = document.location.protocol + '//apis.google.com/js/plusone.js';
    document.getElementById( 'social-buttons' ).appendChild( script );

    window.setTimeout( function () {
        document.getElementById( 'social-buttons' ).removeAttribute( 'class' );
    }, 4000 );

    };

    if (!isMobile()) {
      showSocialButtons();
    } else {
      $('#submit-answer').focus(function() {
        $(this).trigger('click');
      });

      // remove footer content
      $($('footer > p')[0]).text('');
    }
});