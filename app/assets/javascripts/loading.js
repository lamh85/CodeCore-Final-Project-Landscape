// var degrees;
var intervalVariable;
var deactivateLoading;


  // save the real `send`
  var realSend = XMLHttpRequest.prototype.send;

  // replace `send` with a wrapper
  XMLHttpRequest.prototype.send = function() {
      console.log('running');

      // run the real `send`
      realSend.apply(this, arguments);
  }

$(document).ready(function() {

  window.deactivateLoading = function() {
    clearInterval(intervalVariable)
    $('#loading-shell').hide();
    console.log('animation stopped');
  }
  deactivateLoading();

  // "LOADING" ANIMATION
  // -------------------
  activateLoading = function() {
    var degrees = 0;
    intervalVariable = setInterval(function(){
      $('#loading .glyphicon-refresh').css('transform','rotate('+degrees+'deg)');
      degrees += 1;
      console.log("Degrees:" +degrees);
    }, 3); // setInterval
    $('#loading-shell').show();
  }

  $('a').click(activateLoading);

  // On load, stop loading animation
  if (typeof(intervalVariable) != "undefined") {
    clearInterval(intervalVariable);
  }

}) // Close the ready method