$(document).ready(function() {

  // "LOADING" ANIMATION
  // ///////////////////
  // $('#loading-shell.rotating').show();
  var degrees = 0;
  setInterval(function(){
    $('#loading .glyphicon-refresh').css('transform','rotate('+degrees+'deg)');
    if (degrees == 359) {
      degrees = 0
    } else {
      degrees ++
    }
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