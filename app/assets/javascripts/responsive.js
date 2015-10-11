$(document).ready(function() {

  // Copy NAV links into SIDE NAV
  // ////////////////////////////
  for (i = 0; i < $('.wrapper-link:not(#quick-find)').length; i++) {
    href = $('.wrapper-link:not(#quick-find)').eq(i).parent().attr('href');
    text = $('.wrapper-link:not(#quick-find)').eq(i).parent().text();
    $('#side-nav-bar').append('<a href="' +href+ '"><div>' +text+ '</div></a>');
  }
  for (i = 0; i < $('#side-nav-bar a div').length; i++) {
    $('#side-nav-bar a div').eq(i).addClass('wrapper-link');
  }

  // Bind click event to side nav bar
  // ////////////////////////////////
  var sideBarWidth = $('#side-nav-bar').css('width');
  var sideBarShown = false;

  // Wait until right time to bind the loading animation to the click event
  // var bindToLoading = function(){
  //   $('#side-nav-bar .wrapper-link').click(activateLoading);
  // }

  var slideSide = function(){
    if (sideBarShown == false) {
      console.log(sideBarWidth);
      $('#side-nav-modal').animate({right: "0px" }, 100, function(){
        var html = $('#side-nav-bar').html();
        $('#side-nav-bar').html(html);
        bindToLoading();
        sideBarShown = true;
      });
    } else {
      $('#side-nav-modal').animate({right: "-" +sideBarWidth }, 100, function(){sideBarShown = false});
    }
  }; // End animation function

  $('#side-nav-tab, #side-nav-bar .wrapper-link').click(slideSide);

  $(document).click(function(event) {
      if (event.target.id != "side-nav-bar" && event.target.id != "side-nav-tab" && sideBarShown == true) {
        console.log("hello");
        slideSide();
      }
  });
}) // Close the ready method