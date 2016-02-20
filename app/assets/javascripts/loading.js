// var degrees;
var intervalVariable;
var deactivateLoading;

$(document).ready(function() {

  window.deactivateLoading = function() {
    clearInterval(intervalVariable)
    $('#loading-shell').hide();
    console.log('animation stopped');
  }

  // "LOADING" ANIMATION
  // -------------------
  window.activateLoading = function() {
    console.log('animation running');
    var degrees = 0;
    intervalVariable = setInterval(function(){
      $('#loading .glyphicon-refresh').css('transform','rotate('+degrees+'deg)');
      degrees += 1;
    }, 3); // setInterval
    $('#loading-shell').show();
  }

  // On load, stop loading animation
  if (typeof(intervalVariable) != "undefined") {
    clearInterval(intervalVariable);
  }

  $('a').click(activateLoading);

  // save the real `send`
  var originalAjaxSend = XMLHttpRequest.prototype.send;
  // var originalAjaxOnload = XMLHttpRequest.prototype.onload;

  // replace `send` with a wrapper
  XMLHttpRequest.prototype.send = function() {
      window.activateLoading();
      // run the real `send`
      originalAjaxSend.apply(this, arguments);

      this.onreadystatechange = function() {
          window.deactivateLoading();
      }
  }

  // Stop loading animation of user held Shift/Ctrl/Command/etc. with click
  $(document).click(function(event){
      if (event.shiftKey || event.ctrlKey || event.metaKey) {
          setTimeout(window.deactivateLoading(), 1000)
      }
  });

}) // Close the ready method