var colorArray = ["#D39191","#BF6161","#AA3939","#951717","#810000","#D3BD91","#BF9F61","#AA8439","#956B17","#815500"]; // length = 10, max index = 9

var dataRevenue;
var dataClients;
var dataSuppliers;

var ctx0;
var ctx1;
var pieOrg0 = [];
var pieOrg1 = [];
var pieDrawing0;
var pieDrawing1;

var totalSales0 = 0;
var totalSales1 = 0;

var comparisonResultsLoaded = function(){

  // Hide the loading modal
  $('#loading-shell').hide();

  totalSales0 = 0;
  totalSales1 = 0;

  console.log("***STARTING FUNCTION***");

  // var numOfSuppliers0 = <%= @org1.suppliers.count.to_json %>;
  // var numOfSuppliers1 = <%= @org2.suppliers.count.to_json %>;  

  // <canvas id="num-suppliers-sxs"></canvas>

  dataRevenue = {
    labels: [orgName0, orgName1],
    datasets: [ {
      label: "Revenue Comparison",
      fillColor: colorArray[0],
      strokeColor: colorArray[1],
      highlightFill: "#071C4B",
      highlightStroke: "#071C4B",
      data: [revenue0, revenue1]
    } ]
  };

  ctxRevenue = $('#revenue-sxs').get(0).getContext("2d");
  var barDrawingRevenue = new Chart(ctxRevenue).Bar(dataRevenue);
  
  dataClients = {
    labels: [orgName0, orgName1],
    datasets: [ {
      label: "Number of Clients",
      fillColor: colorArray[0],
      strokeColor: colorArray[1],
      highlightFill: "#071C4B",
      highlightStroke: "#071C4B",
      data: [numOfClients0, numOfClients1]
    } ]
  };

  ctxClients = $('#num-clients-sxs').get(0).getContext("2d");
  var barDrawingClients = new Chart(ctxClients).Bar(dataClients);

  dataSuppliers = {
    labels: [orgName0, orgName1],
    datasets: [ {
      label: "Number of Clients",
      fillColor: colorArray[0],
      strokeColor: colorArray[1],
      highlightFill: "#071C4B",
      highlightStroke: "#071C4B",
      data: [numOfSuppliers0, numOfSuppliers1]
    } ]
  };

  ctxSuppliers = $('#num-suppliers-sxs').get(0).getContext("2d");
  var barDrawingSuppliers = new Chart(ctxSuppliers).Bar(dataSuppliers);  

  // Clear the pie chart data
  if (pieDrawing0 != null) {
    pieDrawing0.destroy();
  };
  if (pieDrawing1 != null) {
    pieDrawing1.destroy();
  };
  pieOrg0 = [];
  pieOrg1 = [];

  // IF THE LEFT ORG HAS SALES DATA
  if (salesArray0.length > 0) {
    console.log("checkpoint0");
    ctx0 = $('#canvas-left').get(0).getContext("2d");

    // Loop through the arrays to populate the pie charts
    for (i = 0; i < salesArray0.length; i++ ) {
      var colorIndex = i.toString(); // Convert to string. EG) i = 5; 5.toString = "5";
      colorIndex = colorIndex[colorIndex.length-1]; // EG) (length of "5" minus 1) is 0; colorIndex[0] = "5"; therefore take the 5-index of colorArray, per the push methods below
      pieOrg0.push({
        value: parseInt(salesArray0[i]),
        color: colorArray[colorIndex],
        highlight: "#071C4B",
        label: productsArray0[i]
      }) // Push wedges into pieOrg0
      totalSales0 += parseInt(salesArray0[i]);
    }; // Loop through the arrays to populate the pie charts
    $('#total-header-left').append("$" +insertCommas(totalSales0));

    setTimeout(function(){
      pieDrawing0 = new Chart(ctx0).Pie(pieOrg0);
    }, 1000); 
  }

  // IF THE RIGHT ORG HAS SALES DATA
  if (salesArray1.length > 0) {
    console.log("checkpoint1");
    ctx1 = $('#canvas-right').get(0).getContext("2d");

    // Loop through the arrays to populate the pie charts
    for (i = 0; i < salesArray1.length; i++ ) {
      var colorIndex = i.toString(); // Convert to string. EG) i = 5; 5.toString = "5";
      colorIndex = colorIndex[colorIndex.length-1]; // EG) (length of "5" minus 1) is 0; colorIndex[0] = "5"; therefore take the 5-index of colorArray, per the push methods below
      pieOrg1.push({
        value: parseInt(salesArray1[i]),
        color: colorArray[colorIndex],
        highlight: "#071C4B",
        label: productsArray1[i]
      })
      totalSales1 += parseInt(salesArray1[i]);
    }; // Loop through the arrays to populate the pie charts  
    $('#total-header-right').append("$" +insertCommas(totalSales1));

    setTimeout(function(){
      pieDrawing1 = new Chart(ctx1).Pie(pieOrg1);
    }, 1000);     
  }

  console.log("***ENDING FUNCTION***");  
  
};