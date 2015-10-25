var chartDrawingLeft;
var chartDrawingRight;
var jsonData = [];

var resultsLoaded = function(){
  deactivateLoading();

  $('.full-results').append(" - Total sales: $" + insertCommas(totalSales) );

  // Initialize pie data variables
  // -----------------------------

  // Arrays for storing labels
  // var companies = [];
  // var products = [];
  // var categories = [];
  // var provinces = [];
  // var countries = [];

  // Arrays for storing pie-chart wedges
  // var pieCompanies = [];
  // var pieProducts = [];
  // var pieCategories = [];
  // var pieProvinces = [];
  // var pieCountries = [];

  var wedgesArray = [];
  var labelsArray = [];

  // var marketProperties = [
  //   {labels: companies, pieName: pieCompanies},
  //   {labels: products, pieName: pieProducts},
  //   {labels: categories, pieName: pieCategories},
  //   {labels: provinces, pieName: pieProvinces},
  //   {labels: countries, pieName: pieCountries},
  // ];

  // Example of a pie-chart array
  // var pieExample = [
  //   {
  //     value: "",
  //     color: "",
  //     highlight: "",
  //     label: ""
  //   }];

  var colorArray = ["#D39191","#BF6161","#AA3939","#951717","#810000","#D3BD91","#BF9F61","#AA8439","#956B17","#815500"]; // length = 10, max index = 9

  var sortObject = function(a,b) {
  if (a.value > b.value)
     return -1;
  if (a.value < b.value)
    return 1;
    return 0;
  }

  // Initialize graphics
  // -------------------

  var dropDownValue;
  var leftOrRight;

  $('.canvas').slideUp();

  var ctx;
  var loadPieChart
  var legend;

  var fooData = [ // One array is a pie chart
    { // Each object represents a wedge in the pie chart
      value: "", // sales
    }];

  ctx0 = $('.canvas.left').get(0).getContext("2d");
  chartDrawingLeft = new Chart(ctx0).Pie(fooData);
  ctx1 = $('.canvas.right').get(0).getContext("2d");
  chartDrawingRight = new Chart(ctx1).Pie(fooData);

  // Functions
  // ---------

  var ajaxSuccess = function(data) {
    jsonData = data;

    // Define which pie chart to use
    // for (propertyI = 0; propertyI < marketProperties.length; propertyI++) {
    //   if (marketProperties[propertyI].fieldName == dropDownValue) {
    //     propertySelected = marketProperties[propertyI];
    //   }
    // }

    // Get all the labels
    for (i=0; i < jsonData.length; i++) {
        labelsArray.push(
          jsonData[i][dropDownValue]
        );
      // EG: companies.push(jsonData[i].company)
    } // shovel records into the array

    // Loop through every type of property. Each is an array
    labelsArray.sort();
    for (labelI = 0; labelI < labelsArray.length; labelI++) {
      // If current element is same as the next element...
      while (labelsArray[labelI] == labelsArray[labelI+1]) {
        // ...the delete the next element
        labelsArray.splice((labelI+1),1);
      } // While loop
    } // For loop          

    // Create pie charts without values, BUT with labels and colour
    // For each property, loop through every label
    for (labelI = 0; labelI < labelsArray.length; labelI++) {
      var colorIndex = labelI.toString();
      colorIndex = colorIndex[colorIndex.length-1]; // "length - 1" converts human-readable index to zero-index. EG) The last digit of "345" is the 3rd digit, therefore the zero-index is 2 (3-1 = 2)
      wedgesArray.push({
        value: 0,
        color: colorArray[colorIndex],
        highlight: "#071C4B",
        label: labelsArray[labelI]
      }); // .push
    } // for loop    

    // Populate each wedge with sales total
    // Loop through every wedge (the "length" of the pie)
    for (wedgeI = 0; wedgeI < wedgesArray.length; wedgeI++) {
      // Loop through the JSON data
      for (jsonI = 0; jsonI < jsonData.length; jsonI++){
        // if the label matches
        if (wedgesArray[wedgeI].label == jsonData[jsonI][dropDownValue]) {
          // Increase the sales total
          wedgesArray[wedgeI].value += jsonData[jsonI].sales;
        } // if match
      } // loop through jsonData
    } // loop through pieObject

    // Sort pie chart by value
    wedgesArray.sort(sortObject);

    ctx = $('.canvas.'+leftOrRight).get(0).getContext("2d");

    tableFromLoop = "";

    tableFromLoop = "<div class='table-wrapper'><table><tr> <th>" +capitalize(dropDownValue)+ "</th><th>Sales ($)</th><th>Market Share</th></tr>";
    for (i = 0; i < wedgesArray.length; i++) {
      tableFromLoop += "<tr style='background: " +wedgesArray[i].color+ ";'>";
      tableFromLoop += "<td>" + wedgesArray[i].label + "</td>";
      tableFromLoop += "<td class='cell-number'>" + insertCommas(wedgesArray[i].value) + "</td>";
      var marketShare = Math.round( (wedgesArray[i].value/totalSales) * 100 );
      tableFromLoop += "<td class='cell-number'>" + (marketShare) + "%</td>";
      tableFromLoop += "</tr>";
    }
    tableFromLoop += "<tr class='row-total'><td>TOTAL</td><td class='cell-number'>" +insertCommas(totalSales)+ "</td><td class='cell-number'>100%</td></tr>";
    tableFromLoop += "</table></div>";

    $(".legend-container."+leftOrRight).html(tableFromLoop);
    $(".legend-container."+leftOrRight).slideDown();

    $('.canvas.'+leftOrRight).remove();
    $('.canvas-container.'+leftOrRight).html('<canvas class="canvas market-search '+leftOrRight+'" width="400" height="400"></canvas>');
    ctx = $('.canvas.'+leftOrRight).get(0).getContext("2d");

    destroyAndRender = function(chartDrawing) {
      chartDrawing.destroy();
      setTimeout(function(){
        chartDrawing = new Chart(ctx).Pie(wedgesArray)
      }, 500);
    }

    if (leftOrRight == "left") {
      destroyAndRender(chartDrawingLeft);
    } else {
      destroyAndRender(chartDrawingRight);
    }

    deactivateLoading();
  } // ajaxSuccess function

  var ajaxGet = function() {
    $.ajax({
      url: "/market_searches/show.json",
      beforeSend: function(xhr) {xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))},
      dataType: "json",
      method: "get",
      error: function() { console.log("Cannot GET AJAX file") },
      success: function(data) { ajaxSuccess(data) }
    });// AJAX function 
  } // ajaxGet function

  // When user submits choice
  var clearData = function() {

    if (leftOrRight == 'left') {
      chartDrawingLeft.destroy();
    } else {
      chartDrawingRight.destroy();
    }
    
    // Could not refactor this into a loop because it would not clear the values
    // pieCompanies = [];
    // pieProducts = [];
    // pieCategories = [];
    // pieProvinces = [];
    // pieCountries = [];
    wedgesArray = [];
    labelsArray = [];
    $(".legend-container."+leftOrRight).html('');

    ajaxGet();

  }; // click handler function for loading the pie charts

  // Bind LOAD button click to function
  $('.load-button.left, .load-button.right').click(function(){
    leftOrRight = $(this).data('left-right');
    dropDownValue = $('.pie-drop-down.'+leftOrRight).val();
    $('.canvas.left').slideDown('fast', function(){ // slideDown only one element to execute the callback function only once
      clearData();
    });
  }); // End click handler

  // Bind HIDE button click to function
  $('.hide-pie').click(function(){
    $('.canvas').slideUp('fast');
    $('.legend-container').slideUp('fast');
  });

} // load this whole JS when raw results finish loading