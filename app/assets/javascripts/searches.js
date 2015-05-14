var competitorRevenueArray = [];
var competitorNameArray = []
var barDrawing;
var chartData = {};

if (barDrawing != null) {
  barDrawing.destroy();
};

var loadCompetitorsBarChart = function() {

  Chart.defaults.global.responsive = true;

  competitorNameArray = [];
  competitorRevenueArray = [];
  chartData = {};

  var colorArray = ["#D39191","#BF6161","#AA3939","#951717","#810000","#D3BD91","#BF9F61","#AA8439","#956B17","#815500"]; // length = 10, max index = 9

  // Sort descending
  var sortObject = function(a,b) {
  if (a.revenue > b.revenue)
     return -1;
  if (a.revenue < b.revenue)
    return 1;
    return 0;
  }
  // Yes, this object clears before each query
  competitorRevenueObject.sort(sortObject);

  console.log("RevenueArray in the JS file after sorting = " + competitorRevenueObject);

  for (i = 0; i < competitorRevenueObject.length; i++ ) {
    if (competitorRevenueObject[i].home == true) {
      competitorNameArray.push("*** " + competitorRevenueObject[i].company + " ***");
    } else {
      competitorNameArray.push(competitorRevenueObject[i].company);
    }
    
    competitorRevenueArray.push(competitorRevenueObject[i].revenue);
  }

  chartData = {
    labels: competitorNameArray,
    datasets: [ {
      label: "Competitor Revenue",
      fillColor: colorArray[0],
      strokeColor: colorArray[1],
      highlightFill: "#071C4B",
      highlightStroke: "#071C4B",
      data: competitorRevenueArray
    } ]
  };

  ctx = $('#competitors-revenue').get(0).getContext("2d");
  barDrawing = new Chart(ctx).Bar(chartData);

  $('#competitors-revenue').css('transform','rotate(90)')
}