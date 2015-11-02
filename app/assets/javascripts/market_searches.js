var totalSales;

var renderTotal = function(data){
  marketsValues = [];
  for (i = 0; i < data.length; i++) {
    marketsValues.push(data[i].sales)
  }
  totalSales = makeSum(marketsValues);
  $('.full-results').append(" - Total sales: $" + insertCommas(totalSales) );
}

var ajaxGet = function(callBack) {
  $.ajax({
    url: "/market_searches/show.json",
    beforeSend: function(xhr) {xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))},
    dataType: "json",
    method: "get",
    success: function(data) { callBack(data) }
  });// AJAX function 
} // ajaxGet function

var resultsLoaded = function(){

  ajaxGet(renderTotal);

  // Initialize pie data variables
  // -----------------------------

  var wedgesArray = [];
  var labelsArray = [];
  var colorArray = ["#D39191","#BF6161","#AA3939","#951717","#810000","#D3BD91","#BF9F61","#AA8439","#956B17","#815500"]; // length = 10, max index = 9

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
//    color: "",
//    highlight: "",
//    label: ""
    }];

  drawingObjects = {
    left: "",
    right: "",
  };

  ctx0 = $('.canvas.left').get(0).getContext("2d");
  drawingObjects.left = new Chart(ctx0).Pie(fooData);
  ctx1 = $('.canvas.right').get(0).getContext("2d");
  drawingObjects.right = new Chart(ctx1).Pie(fooData);

  // Functions
  // -------------------------------

  var ajaxSuccess = function(data) {
    jsonData = data;

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

    drawingObjects[leftOrRight].destroy();
    setTimeout(function(){
      drawingObjects[leftOrRight] = new Chart(ctx).Pie(wedgesArray)
    }, 500);

    deactivateLoading();
  } // ajaxSuccess function

  // When user submits choice
  var clearData = function() {

    drawingObjects[leftOrRight].destroy();
    wedgesArray = [];
    labelsArray = [];
    $(".legend-container."+leftOrRight).html('');

    ajaxGet(ajaxSuccess);

  }; // click handler function for loading the pie charts

  // $(document).ready(function(){
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
  // });

  $('.wrapper-market-search button').click(function(){
    resultsLoaded();
  });
  
} // load this whole JS when raw results finish loading