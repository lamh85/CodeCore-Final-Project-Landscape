var chartDrawingLeft;
var chartDrawingRight;
var jsonData = [];

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
  var leftOrRight;

  var fooData = [ // One array is a pie chart
    { // Each object represents a wedge in the pie chart
      value: "", // sales
    }];

  ctx0 = $('.canvas.left').get(0).getContext("2d");
  chartDrawingLeft = new Chart(ctx0).Pie(fooData);
  ctx1 = $('.canvas.right').get(0).getContext("2d");
  chartDrawingRight = new Chart(ctx1).Pie(fooData);

  // When user submits choice
  // ////////////////////////

  var buttonHandler = function(dropDownValue, leftOrRight) {

    // Could not refactor this into a loop because it would not clear the values
    var pieCompanies = [];
    var pieProducts = [];
    var pieCategories = [];
    var pieProvinces = [];
    var pieCountries = [];
    $(".legend-container."+leftOrRight).html('');

    $.ajax({
      url: "/market_searches/show.json",
      beforeSend: function(xhr) {xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))},
      dataType: "json",
      method: "get",
      error: function() { console.log("Cannot GET AJAX file") },
      success: function(data){
        console.log('json data-get successful');

        jsonData = data;

        marketProperties = [
          {labels: companies, pieName: pieCompanies, fieldName: "company" },
          {labels: products, pieName: pieProducts, fieldName: "product"},
          {labels: categories, pieName: pieCategories, fieldName: "category"},
          {labels: provinces, pieName: pieProvinces, fieldName: "province"},
          {labels: countries, pieName: pieCountries, fieldName: "country"}
        ];

        // Populate the arrays with labels
        for (i=0; i<jsonData.length; i++) {
          for (propertyI = 0; propertyI < marketProperties.length; propertyI ++){
            marketProperties[propertyI].labels.push(
              jsonData[i][marketProperties[propertyI].fieldName]
            );
          }
          // EG: companies.push(jsonData[i].company)
        } // shovel records into the array

        console.log('The labels length is:' +marketProperties[0].labels.length);

        // Loop through every type of property. Each is an array
        for (propertyI = 0; propertyI < marketProperties.length; propertyI++ ) {
          marketProperties[propertyI].labels.sort();
          for (labelI = 0; labelI < marketProperties[propertyI].labels.length; labelI++) {
            // If current element is same as the next element...
            while (marketProperties[propertyI].labels[labelI] == marketProperties[propertyI].labels[labelI+1]) {
              // ...the delete the next element
              marketProperties[propertyI].labels.splice((labelI+1),1);
            } // While loop
          } // For loop          
        }

        console.log('The labels length is:' +marketProperties[0].labels.length);

        // Create pie charts without values, BUT with labels and colour
        // Loop through every property
        for (propertyI = 0; propertyI < marketProperties.length; propertyI++ ) {
          // For each property, loop through every label
          for (labelI = 0; labelI < marketProperties[propertyI].labels.length; labelI++) {
            var colorIndex = labelI.toString();
            colorIndex = colorIndex[colorIndex.length-1]; // "length - 1" converts human-readable index to zero-index. EG) The last digit of "345" is the 3rd digit, therefore the zero-index is 2 (3-1 = 2)
            marketProperties[propertyI].pieName.push({
              value: 0,
              color: colorArray[colorIndex],
              highlight: "#071C4B",
              label: marketProperties[propertyI].labels[labelI]
            }); // .push
          } // for loop
        }

        console.log('The pie length is:' +marketProperties[0].pieName.length);

        // Loop through every property
        for (propertyI = 0; propertyI < marketProperties.length; propertyI++){
          // Populate each wedge with sales total
          // Loop through every wedge (the "length" of the pie)
          for (wedgeI = 0; wedgeI < marketProperties[propertyI].pieName.length; wedgeI++) {
            // Loop through the JSON data
            for (jsonI = 0; jsonI < jsonData.length; jsonI++){
              // if the label matches
              if (marketProperties[propertyI].pieName[wedgeI].label == jsonData[jsonI][marketProperties[propertyI].fieldName]) {
                marketProperties[propertyI].pieName[wedgeI].value += jsonData[jsonI].sales;
              } // if match
            } // loop through jsonData
          } // loop through pieObject        
        }

        // Define which pie chart to use
        for (propertyI = 0; propertyI < marketProperties.length; propertyI++) {
          if (marketProperties[propertyI].fieldName == dropDownValue) {
            pieSelected = marketProperties[propertyI].pieName;
          }
        }

        console.log('The pie length of pieSelected is:' +pieSelected.length);        

        // Sort pie chart by value
        pieSelected.sort(sortObject);

        ctx = $('.canvas.'+leftOrRight).get(0).getContext("2d");

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

        $(".legend-container."+leftOrRight).html(tableFromLoop);
        $(".legend-container."+leftOrRight).slideDown();

        $('.canvas.'+leftOrRight).remove();
        $('.canvas-container.'+leftOrRight).html('<canvas class="canvas market-search '+leftOrRight+'" width="400" height="400"></canvas>');
        ctx = $('.canvas.'+leftOrRight).get(0).getContext("2d");

        destroyAndRender = function(chartDrawing) {
          chartDrawing.destroy();
          setTimeout(function(){
            chartDrawing = new Chart(ctx).Pie(pieSelected)
          }, 500);
        }

        if (leftOrRight == "left") {
          destroyAndRender(chartDrawingLeft);
        } else {
          destroyAndRender(chartDrawingRight);
        }

        deactivateLoading();

      }// end the success function
    });// AJAX function 

  }; // click handler function for loading the pie charts

  $('.full-results').append(" - Total sales: $" + insertCommas(totalSales) );

  // Function for left button
  $('.load-button.left, .load-button.right').click(function(){
    leftOrRight = $(this).data('left-right');
    dropDownValue = $('.pie-drop-down.'+leftOrRight).val();
    if (leftOrRight == 'left') {
      chartDrawingLeft.destroy();
    } else {
      chartDrawingRight.destroy();
    }
    $('.canvas').slideDown('fast', function(){
      buttonHandler(dropDownValue, leftOrRight);
    });
  }); // End click handler

  $('.hide-pie').click(function(){
    $('.canvas').slideUp('fast');
    $('.legend-container').slideUp('fast');
  });

} // load this whole JS when raw results finish loading