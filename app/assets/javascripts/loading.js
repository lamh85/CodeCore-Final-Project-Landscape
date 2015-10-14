var degrees;
var intervalVariable;
var deactivateLoading;

$(document).ready(function() {

  deactivateLoading = function() {
    // Prevent presistant setInterval when a new page loads
    degrees = undefined;
    intervalVariable = undefined;
    $('#loading-shell').hide();
  }
  deactivateLoading();

  // "LOADING" ANIMATION
  // -------------------
  activateLoading = function() {
    degrees = 0;
    intervalVariable = setInterval(function(){
      $('#loading .glyphicon-refresh').css('transform','rotate('+degrees+'deg)');
      degrees += 20;
    }, 250); // setInterval
    $('#loading-shell').show();
  }

  // save the real `send`
  var realSend = XMLHttpRequest.prototype.send;

  // replace `send` with a wrapper
  XMLHttpRequest.prototype.send = function() {
      activateLoading();

      // run the real `send`
      realSend.apply(this, arguments);
  }

  // On load, stop loading animation
  if (typeof(intervalVariable) != "undefined") {
    clearInterval(intervalVariable);
  }

}) // Close the ready method