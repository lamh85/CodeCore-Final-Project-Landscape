var insertCommas = function(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

$(document).ready(function() {

  // FUNCTION FOR RE-RENDERING HTML ELEMENT
  // //////////////////////////////////////

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

}) // Close the ready method