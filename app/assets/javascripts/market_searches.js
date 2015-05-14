var chartDrawing = [];

var foo = "hello world";

var resultsLoaded = function(){

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

  var colorArray = ["#D39191","#BF6161","#AA3939","#951717","#810000","#D3BD91","#BF9F61","#AA8439","#956B17","#815500"]; // length = 10, max index = 9

  var ctx;
  var loadPieChart
  var legend;
  var totalSales = 0;

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
  var chartDrawingLeft;
  var chartDrawingRight;

  var fooData = [ // One array is a pie chart
    { // Each object represents a wedge in the pie chart
      value: "", // sales
    }];

  ctx0 = $('canvas').get(0).getContext("2d");
  chartDrawingLeft = new Chart(ctx0).Pie(fooData);
  ctx1 = $('canvas').get(1).getContext("2d");
  chartDrawingRight = new Chart(ctx1).Pie(fooData);
  console.log("foo data loaded into pie");

  // When user submits choice
  // ////////////////////////

  var buttonHandler = function(dropDownValue, buttonID, canvasContID, canvasID, chartDrawing, legendContID){

    // Re-initialize variabls
    // if (chartDrawing != undefined) {
    //   // chartDrawing.clear();
    //   chartDrawing.destroy();
    // }
    // $(canvasContID).html('<canvas id="' +canvasID+ '" width="400" height="400"></canvas>');

    var pieCompanies = [];
    var pieProducts = [];
    var pieCategories = [];
    var pieProvinces = [];
    var pieCountries = [];
    $(legendContID).html('');

    // Define which pie chart to use
    if (dropDownValue == "Company") { pieSelected = pieCompanies };
    if (dropDownValue == "Product") { pieSelected = pieProducts };
    if (dropDownValue == "Category") { pieSelected = pieCategories };
    if (dropDownValue == "Province") { pieSelected = pieProvinces };
    if (dropDownValue == "Country") { pieSelected = pieCountries };

    console.log("click handler fired!");
    console.log("pieSelected = " + dropDownValue);

    $.ajax({
      url: "http://localhost:3000/market_searches/show.json",
      beforeSend: function(xhr) {xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))},
      dataType: "json",
      method: "get",
      error: function() { console.log("Cannot GET AJAX file") },
      success: function(data){

        // Get the JSON data and find the total
        jsonData = data;
        totalSales = 0;
        for (i=0; i<jsonData.length; i++) {
          totalSales += jsonData[i].sales;
        }

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
            console.log("color index =" + colorIndex);
          } // for loop
        }

        // Populate each wedge with sales total
        // Loop through every wedge
        for (i = 0; i < pieCompanies.length; i++) {
          // Loop through the JSON data
          for (x = 0; x < jsonData.length; x++){
            // if the label matches
            if (pieCompanies[i].label == jsonData[x].company) {
              pieCompanies[i].value = pieCompanies[i].value + jsonData[x].sales;
            } // if match
          } // loop through jsonData
        } // loop through pieObject

        for (i = 0; i < pieProducts.length; i++) {
          for (x = 0; x < jsonData.length; x++){
            if (pieProducts[i].label == jsonData[x].product) {
              pieProducts[i].value = pieProducts[i].value + jsonData[x].sales;
            } // if match
          } // loop through jsonData
        } // loop through pieObject

        for (i = 0; i < pieCategories.length; i++) {
          for (x = 0; x < jsonData.length; x++){
            if (pieCategories[i].label == jsonData[x].category) {
              pieCategories[i].value = pieCategories[i].value + jsonData[x].sales;
            } // if match
          } // loop through jsonData
        } // loop through pieObject

        for (i = 0; i < pieProvinces.length; i++) {
          for (x = 0; x < jsonData.length; x++){
            if (pieProvinces[i].label == jsonData[x].province) {
              pieProvinces[i].value = pieProvinces[i].value + jsonData[x].sales;
            } // if match
          } // loop through jsonData
        } // loop through pieObject

        for (i = 0; i < pieCountries.length; i++) {
          for (x = 0; x < jsonData.length; x++){
            if (pieCountries[i].label == jsonData[x].country) {
              pieCountries[i].value = pieCountries[i].value + jsonData[x].sales;
            } // if match
          } // loop through jsonData
        } // loop through pieObject

        // Sort pie chart by value
        pieSelected.sort(sortObject);

        // Show the pie chart via .slideDown

        ctx = $(canvasID).get(0).getContext("2d");

        if (buttonID == '#load-button-left')
          { chartDrawingLeft = new Chart(ctx).Pie(pieSelected) }
        else if (buttonID == '#load-button-right')
          { chartDrawingRight = new Chart(ctx).Pie(pieSelected) }

        tableFromLoop = "";

        tableFromLoop = "<table><tr> <th>" +dropDownValue+ "</th><th>Sales ($)</th><th>Market Share</th></tr>";
        for (i = 0; i < pieSelected.length; i++) {
          tableFromLoop += "<tr style='background: " +pieSelected[i].color+ ";'>";
          tableFromLoop += "<td>" + pieSelected[i].label + "</td>";
          tableFromLoop += "<td class='cell-number'>" + insertCommas(pieSelected[i].value) + "</td>";
          var marketShare = Math.round( (pieSelected[i].value/totalSales) * 100 );
          tableFromLoop += "<td class='cell-number'>" + (marketShare) + "%</td>";
          tableFromLoop += "</tr>";
        }
        tableFromLoop += "<tr class='row-total'><td>TOTAL</td><td class='cell-number'>" +insertCommas(totalSales)+ "</td><td class='cell-number'>100%</td></tr>";
        tableFromLoop += "</table>";

        $(legendContID).html(tableFromLoop);

      }// end the success function
    });// AJAX function 

  }; // click handler function 

  // Function for left button
  $('#load-button-left').click(function(){
    chartDrawingLeft.destroy();
    $('.canvas').show(function(){      
      dropDownValue = $('#pie-drop-down-left').val();
      buttonID = '#load-button-left';
      canvasContID = '#canvas-container-left';
      canvasID = '#canvas-left';
      legendContID = '#legend-container-left';
      buttonHandler( dropDownValue, buttonID, canvasContID, canvasID, chartDrawingLeft, legendContID );
    });
  }); 

    // Function for right button
  $('#load-button-right').click(function(){
    chartDrawingRight.destroy();
    // $('.canvas').slideDown();
    dropDownValue = $('#pie-drop-down-right').val();
    buttonID = '#load-button-right';
    canvasContID = '#canvas-container-right';
    canvasID = '#canvas-right';
    legendContID = '#legend-container-right';
    buttonHandler( dropDownValue, buttonID, canvasContID, canvasID, chartDrawingRight, legendContID );
  });

}