// var degrees;
var intervalVariable;
var deactivateLoading;

$(document).ready(function() {

  window.deactivateLoading = function() {
    clearInterval(intervalVariable)
    $('#loading-shell').hide();
    console.log('animation stopped');
  }
  deactivateLoading();

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
  var realSend = XMLHttpRequest.prototype.send;

  // replace `send` with a wrapper
  XMLHttpRequest.prototype.send = function() {
      window.activateLoading();

      // run the real `send`
      realSend.apply(this, arguments);
  }

}) // Close the ready method