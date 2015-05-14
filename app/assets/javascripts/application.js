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

$(document).ready(function() {

  // Function: Sort checkboxes
  // var orgSortFn = function (parent) {
  //   $(parent + " .check_boxes .checkbox").sort(asc_sort).appendTo(parent + " .check_boxes");
  //   function asc_sort(a, b){
  //       return ($(b).text()) < ($(a).text()) ? 1 : -1;    
  //   };
  // }

  // Feed lists into the function above
  // var orgArray = [".list-competitors",".list-suppliers",".list-clients"];
  // for (i = 0; i < orgArray.length; i ++) {
  //   orgSortFn( orgArray[i] );
  // }

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

  // Add a "loading..." indicator
  var showLoading = function(){
    $('input[type="submit"]').click(function(){ 
      $('#loading-shell').show();
      var degrees = 0;
      setInterval(function(){
        $('#loading .glyphicon-refresh').css('transform','rotate('+degrees+'deg)');
        if (degrees == 359) {
          degrees = 0
        } else {
          degrees ++      
        }
      }, 5);
    });
  }
  showLoading();

  var formValidation = function(){
    // Listener for change in ALL "select" tags
    $('select[name*="group"]').change(function(){
      // DISABLE the list of org names
      if ( $(this).val() == "all" ) {
        $(this).parent().parent().next().find($('select')).attr("disabled",true);
        // $(this).parent().parent().next().slideUp('fast').css('background','yellow');
      } else {
        $(this).parent().parent().next().find($('select')).attr("disabled",false);
        // $(this).parent().parent().next().slideDown('fast').css('background','white');
      };

      // HIDE "contains text" option
      if ( $(this).val() == "revenue" ) {
        $(this).parent().parent().next().find('select').find('option[value="includes"]').hide();
      } else {
        $(this).parent().parent().next().find('select').find('option[value="includes"]').show();
      }

      // $('.nested-fields').children().eq(2).children().find('select').val() == "revenue"
    }).change();
  };
  formValidation();

  $('.container').on('cocoon:after-insert', function(e, newFields) {
    formValidation();
  });

  var quickFindSelectTag = $('#quick-find').find('select');
  quickFindSelectTag.change(function(){
    if ( $(this).val() != "" ) {
    window.location.href = '/organizations/' + quickFindSelectTag.val();
    }
  }).change();
  
  // var addCommas = function(x) {
  //   return x + "foo";
  //   return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  // }  
  // Chart.defaults.global.scaleLabel = "<%= addCommas(value) %>";



  // Manually render a form
  // var formSearchFn = function()
  // $('#results').html('<%= j render partial: "results" %>');

  // Find the element with ID containing "org"
  // $("[id*='org']").attr('disabled',true)

}) // Close the ready method