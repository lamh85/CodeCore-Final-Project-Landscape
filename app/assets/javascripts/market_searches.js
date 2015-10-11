var chartDrawing = [];
var chartDrawingLeft;
var chartDrawingRight;

var resultsLoaded = function(){
  deactivateLoading();

  $('.canvas').slideUp();

  var marketProperty;

  // First step: shovel into these arrays.
  // EG: Extract the company name of every JS Object, and shovel into companies array
  var companies = [];
  var products = [];
  var categories = [];
  var provinces = [];
  var countries = [];

  var marketPropArrays = [];

  var jsonData = [];
  var pieExample = [ // One array is a pie chart
    { // Each object represents a wedge in the pie chart
      value: "", // sales
      color: "", // hex code
      highlight: "", // hex code
      label: "" // market attribute: company, product, category, etc.
    }];

  var dropDownValue = "";
  var pieSelected = [];

  var pieCompanies = [];
  var pieProducts = [];
  var pieCategories = [];
  var pieProvinces = [];
  var pieCountries = [];
  var pieTypes = [pieCompanies, pieProducts, pieCategories, pieProvinces, pieCountries];

  var colorArray = ["#D39191","#BF6161","#AA3939","#951717","#810000","#D3BD91","#BF9F61","#AA8439","#956B17","#815500"]; // length = 10, max index = 9

  var ctx;
  var loadPieChart
  var legend;

  var insertCommas = function(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  var sortObject = function(a,b) {
  if (a.value > b.value)
     return -1;
  if (a.value < b.value)
    return 1;
    return 0;
  }

  var dropDownValue;
  var buttonID;
  var canvasContID;
  var canvasID;
  var legendContID;

  var fooData = [ // One array is a pie chart
    { // Each object represents a wedge in the pie chart
      value: "", // sales
    }];

  ctx0 = $('canvas.left').get(0).getContext("2d");
  chartDrawingLeft = new Chart(ctx0).Pie(fooData);
  ctx1 = $('canvas.right').get(1).getContext("2d");
  chartDrawingRight = new Chart(ctx1).Pie(fooData);

  // When user submits choice
  // ////////////////////////

  var buttonHandler = function(dropDownValue, buttonID, canvasContID, canvasID, chartDrawing, legendContID){

    console.log("is chartDrawingLeft defined? " + (chartDrawingLeft == undefined));

    // Could not refactor this into a loop because it would not clear the values
    var pieCompanies = [];
    var pieProducts = [];
    var pieCategories = [];
    var pieProvinces = [];
    var pieCountries = [];
    $(legendContID).html('');

    // Define which pie chart to use
    switch (dropDownValue) {
      case "Company":
        pieSelected = pieCompanies;
        break;
      case "Product":
        pieSelected = pieProducts;
        break;      
      case "Category":
        pieSelected = pieCategories;
        break;      
      case "Province":
        pieSelected = pieProvinces;
        break;
      case "Country":
        pieSelected = pieCountries;
        break;
    }

    console.log("click handler fired!");
    console.log("pieSelected = " + dropDownValue);

    $.ajax({
      url: "/market_searches/show.json",
      beforeSend: function(xhr) {xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))},
      dataType: "json",
      method: "get",
      error: function() { console.log("Cannot GET AJAX file") },
      success: function(data){

        jsonData = data;

        console.log("total sales = " + totalSales);

        // Populate the arrays
        for (i=0; i<jsonData.length; i++) {
          companies.push(jsonData[i].company);
          products.push(jsonData[i].product);
          categories.push(jsonData[i].category);
          provinces.push(jsonData[i].province);
          countries.push(jsonData[i].country);
        } // shovel records into the array

        marketPropArrays = [companies,products,categories,provinces,countries];

        for (arrayFeeder = 0; arrayFeeder < marketPropArrays.length; arrayFeeder++ ) {
          marketPropArrays[arrayFeeder].sort();
          for (sortCounter = 0; sortCounter < marketPropArrays[arrayFeeder].length; sortCounter++) {
            // If current element is same as the next element...
            while (marketPropArrays[arrayFeeder][sortCounter] == marketPropArrays[arrayFeeder][sortCounter+1]) {
              // ...the delete the next element
              marketPropArrays[arrayFeeder].splice((sortCounter+1),1);
            } // While loop
          } // For loop          
        }

        // Create pie charts without values, BUT with labels and colour
        for (arrayFeeder = 0; arrayFeeder < marketPropArrays.length; arrayFeeder++ ) {
          var pieMystery = [];
          if (marketPropArrays[arrayFeeder] == companies) { pieMystery = pieCompanies};
          if (marketPropArrays[arrayFeeder] == products) { pieMystery = pieProducts};
          if (marketPropArrays[arrayFeeder] == categories) { pieMystery = pieCategories};
          if (marketPropArrays[arrayFeeder] == provinces) { pieMystery = pieProvinces};
          if (marketPropArrays[arrayFeeder] == countries) { pieMystery = pieCountries};
          for (i = 0; i < marketPropArrays[arrayFeeder].length; i++) {
            var colorIndex = i.toString();
            colorIndex = colorIndex[colorIndex.length-1]; // "length - 1" converts human-readable index to zero-index. EG) The last digit of "345" is the 3rd digit, therefore the zero-index is 2 (3-1 = 2)
            pieMystery.push({
              value: 0,
              color: colorArray[colorIndex],
              highlight: "#071C4B",
              label: marketPropArrays[arrayFeeder][i]
            }); // .push
            // console.log("color index =" + colorIndex);
          } // for loop
        }

        // Each value for pieName is an array of objects. Each object is one pie wedge. Each object's properties are colour, label, value, etc.
        pieFieldPairs = [{pieName: pieCompanies, fieldName: "company"},
        {pieName: pieProducts, fieldName: "product"},
        {pieName: pieCategories, fieldName: "category"},
        {pieName: pieProvinces, fieldName: "province"},
        {pieName: pieCountries, fieldName: "country"}];

        // Loop through every pie-chart array
        for (pieI = 0; pieI < pieFieldPairs.length; pieI++){
          // Populate each wedge with sales total
          // Loop through every wedge (the "length" of the pie)
          for (wedgeI = 0; wedgeI < pieFieldPairs[pieI].pieName.length; wedgeI++) {
            // Loop through the JSON data
            for (jsonI = 0; jsonI < jsonData.length; jsonI++){
              // if the label matches
              if (pieFieldPairs[pieI].pieName[wedgeI].label == jsonData[jsonI][pieFieldPairs[pieI].fieldName]) {
                pieFieldPairs[pieI].pieName[wedgeI].value += jsonData[jsonI].sales;
              } // if match
            } // loop through jsonData
          } // loop through pieObject        
        }

        // Sort pie chart by value
        pieSelected.sort(sortObject);

        ctx = $(canvasID).get(0).getContext("2d");

        tableFromLoop = "";

        tableFromLoop = "<div class='table-wrapper'><table><tr> <th>" +dropDownValue+ "</th><th>Sales ($)</th><th>Market Share</th></tr>";
        for (i = 0; i < pieSelected.length; i++) {
          tableFromLoop += "<tr style='background: " +pieSelected[i].color+ ";'>";
          tableFromLoop += "<td>" + pieSelected[i].label + "</td>";
          tableFromLoop += "<td class='cell-number'>" + insertCommas(pieSelected[i].value) + "</td>";
          var marketShare = Math.round( (pieSelected[i].value/totalSales) * 100 );
          tableFromLoop += "<td class='cell-number'>" + (marketShare) + "%</td>";
          tableFromLoop += "</tr>";
        }
        tableFromLoop += "<tr class='row-total'><td>TOTAL</td><td class='cell-number'>" +insertCommas(totalSales)+ "</td><td class='cell-number'>100%</td></tr>";
        tableFromLoop += "</table></div>";

        $(legendContID).html(tableFromLoop);
        $('.legend-container').slideDown();

        if (buttonID == '#load-button-left') {
          chartDrawingLeft.destroy();
          $('#canvas-left').remove();
          $('#canvas-container-left').html('<canvas id="canvas-left" class="canvas market-search" width="400" height="400"></canvas>');
          ctx = $('#canvas-left').get(0).getContext("2d");
          setTimeout(function(){ chartDrawingLeft = new Chart(ctx).Pie(pieSelected) }, 500);
        }
        else if (buttonID == '#load-button-right') {
          $('#canvas-right').remove();
          $('#canvas-container-right').html('<canvas id="canvas-right" class="canvas market-search" width="400" height="400"></canvas>');
          ctx = $('#canvas-right').get(0).getContext("2d");
          chartDrawingRight.destroy();
          setTimeout(function(){ chartDrawingRight = new Chart(ctx).Pie(pieSelected) }, 500);
        }
        deactivateLoading();

      }// end the success function
    });// AJAX function 

    Chart.defaults.global.showTooltips = true;

  }; // click handler function for loading the pie charts

  $('.full-results').append(" - Total sales: $" + insertCommas(totalSales) );

  // Function for left button
  $('#load-button').click(function(){
    leftOrRight = $(this).data('left-right');
    if (leftOrRight == 'left') {
      chartDrawingLeft.destroy();
    } else {
      chartDrawingRight.destroy();
    }
    $('.canvas').slideDown('fast', function(){
      buttonHandler(dropDownValue, leftOrRight);
    });
  }); // End click handler

  // Function for left button
  $('#load-button-left').click(function(){
    chartDrawingLeft.destroy();
    console.log(chartDrawingLeft);
    $('.canvas').slideDown('fast',function(){      
      dropDownValue = $('#pie-drop-down-left').val();
      buttonID = '#load-button-left';
      canvasContID = '#canvas-container-left';
      canvasID = '#canvas-left';
      legendContID = '#legend-container-left';
      buttonHandler( dropDownValue, buttonID, canvasContID, canvasID, chartDrawingLeft, legendContID );
    });
  }); // End click handler

  // Function for right button
  $('#load-button-right').click(function(){
    chartDrawingRight.destroy();
    $('.canvas').slideDown('fast',function(){      
      dropDownValue = $('#pie-drop-down-right').val();
      buttonID = '#load-button-right';
      canvasContID = '#canvas-container-right';
      canvasID = '#canvas-right';
      legendContID = '#legend-container-right';
      buttonHandler( dropDownValue, buttonID, canvasContID, canvasID, chartDrawingRight, legendContID );
      });
  }); // End click handler

  $('.hide-pie').click(function(){
    $('.canvas').slideUp('fast');
    $('.legend-container').slideUp('fast');
  });

} // load this whole JS when raw results finish loading