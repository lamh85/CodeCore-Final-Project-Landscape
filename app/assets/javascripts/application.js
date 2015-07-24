// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or any plugin's vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
//= require jquery.turbolinks
//= require bootstrap-sprockets
//= require jquery_ujs
//= require turbolinks
//= require cocoon
//= require_tree .
  
var insertCommas = function(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

$(document).ready(function() {

  // FILTER CHECKBOXES
  // /////////////////
  $("#clearFilterCheckBox").click(function(event){
    event.preventDefault();
    $('#inputFilterCheckBox').val("").change();
  });

  $('#inputFilterCheckBox').change(function(){
    var inputText = $('#inputFilterCheckBox').val();
    $(".group-sort-competitors .checkbox label:not(:contains('"+inputText+"''))").parent().hide();
    $(".group-sort-competitors .checkbox label:contains('"+inputText+"')").parent().show();
  }).keyup(function(){
    $(this).change();
  });

  // "LOADING" ANIMATION
  // ///////////////////
  $('#navOne a, #navTwo a, #current-user a, input[type="submit"], .wrapper-search button, .wrapper-market-search button, .wrapper-compare button').click(function(event){ 

    // Prevents the handler from binding to CMD+click, SHIFT+click, etc.
    if (!event.shiftKey && !event.ctrlKey && !event.metaKey) {

      $('#loading-shell').show();
      var degrees = 0;
      setInterval(function(){
        $('#loading .glyphicon-refresh').css('transform','rotate('+degrees+'deg)');
        if (degrees == 359) {
          degrees = 0
        } else {
          degrees ++
        }
      }, 1); // setInterval
    } // if not event.shiftKey, not event.ctrlKey, AND not event.metaKey
  }); // click handler

  // DROP DOWN VALIDATION
  // ////////////////////
  var formValidation = function(){
    // Listener for change in ALL "select" tags
    $('select[name*="group"]').change(function(){
      // DISABLE the list of org names
      if ( $(this).val() == "all" ) {
        $(this).parent().parent().next().find($('select')).attr("disabled",true);
      } else {
        $(this).parent().parent().next().find($('select')).attr("disabled",false);
      };
    }).change();

    $('.field-property').change(function(){
      if ( ( $(this).val() != "revenue" ) && ( $(this).val() != "" ) ) {
        $(this).parent().parent().next().find('.field-logic').val('includes');
      } else if ( $(this).val() == "revenue" ) {
        $(this).parent().parent().next().find('.field-logic').val('<');
      }
    }).change();
  };
  formValidation();

  $('.container').on('cocoon:after-insert', function(e, newFields) {
    formValidation();
  });

  // QUICK FIND ORG
  // //////////////
  var quickFindSelectTag = $('#quick-find').find('select');
  quickFindSelectTag.change(function(){
    if ( $(this).val() != "" ) {
    window.location.href = '/organizations/' + quickFindSelectTag.val();
    }
  }).change();

  // Add classes to SUBMIT buttons
  // /////////////////////////////
  $('.wrapper-compare button').addClass('btn btn-primary');
  $('.wrapper-market-search button, .wrapper-search button').addClass('btn btn-success');

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
  width = $('#side-nav-bar').css('width');
  rightValue = "0px";
  slideSide = function(){
      $('#side-nav-modal').animate({right: rightValue }, 100, function(){
        // Toggle rightValue
        (rightValue !== "0px") ? rightValue = "0px" : rightValue = "-" + width;
      }); // End animation function
    }
  $('#side-nav-tab').click(slideSide);

}) // Close the ready method