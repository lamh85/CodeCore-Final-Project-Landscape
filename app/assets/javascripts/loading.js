$(document).ready(function() {

  // save the real `send`
  var realSend = XMLHttpRequest.prototype.send;

  // replace `send` with a wrapper
  XMLHttpRequest.prototype.send = function() {
      console.log('before send!');

      // run the real `send`
      realSend.apply(this, arguments);
  }

  // "LOADING" ANIMATION
  // ///////////////////
  // $('#loading-shell.rotating').show();
  var degrees = 0;
  // console.log('the degrees is: ' +degrees);
  setInterval(function(){
    $('#loading .glyphicon-refresh').css('transform','rotate('+degrees+'deg)');
    if (degrees == 359) {
      degrees = 0
    } else {
      degrees ++
    }
    // console.log('degrees is: ' +degrees)
  }, 1); // setInterval

  activateLoading = function() {
    $('#loading-shell').addClass('rotating');
  }

  // On load, stop loading animation
  if (typeof(intervalVariable) != "undefined") {
    clearInterval(intervalVariable);
  }

  $('#navOne a, #navTwo a, #current-user a, input[type="submit"], .wrapper-search button, .wrapper-market-search button, .wrapper-compare button, .wrapper-link').click(function(event){
    // Prevents the handler from binding to CMD+click, SHIFT+click, etc.
    if (!event.shiftKey && !event.ctrlKey && !event.metaKey) {
      activateLoading();
    } // if not event.shiftKey, not event.ctrlKey, AND not event.metaKey
  }); // click handler

}) // Close the ready method