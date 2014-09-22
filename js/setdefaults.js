

// checkboxes
var CHECK_BOX_VALUES = ['add', 'sub', 'mul', 'div', 'pow', 'sqrt'];

// read cookies
$(function() {

  // slider
  var b = $.cookie('upperbound');

  if (b !== undefined) {
    $('#math-range-slider').val(b);
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
    var bound = $(a.target).val();
    $.cookie('upperbound', bound, { expires: 7 });
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
    document.getElementById('viewport').insertAdjacentHTML('beforeEnd', html);

    var script = document.createElement('script');
    script.async = true;
    script.src = document.location.protocol + '//connect.facebook.net/en_US/all.js#xfbml=1&appId=467518076718074';
    document.getElementById('fb-root').appendChild(script);

    script = document.createElement('script');
    script.async = true;
    script.src = document.location.protocol + '//platform.twitter.com/widgets.js';
    document.getElementById('social-buttons').appendChild(script);

    script = document.createElement('script');
    script.async = true;
    script.src = document.location.protocol + '//apis.google.com/js/plusone.js';
    document.getElementById('social-buttons').appendChild(script);

    window.setTimeout(function () {
        document.getElementById('social-buttons').removeAttribute('class');
    }, 4000);

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


$(function() {
  $('#facebookshare').click(function() {
    var score = $('#results .score').text();
    FB.ui(
      {
        method: 'feed',
        name: '10 seconds math',
        link: 'http://www.mental-math-trainer.com/',
        picture: 'www.mental-math-trainer.com/img/mental-math-trainer.png',
        caption: '10 seconds of math. be fast. be clever.',
        description: 'Check out my math score: ' + score + '! In just 10 seconds <3'
      },
      function(response) {
        // if (response && response.post_id) {
        //   console.log('Post was published.');
        // } else {
        //   console.log('Post was not published.');
        // }
      }
    );

  })
});


