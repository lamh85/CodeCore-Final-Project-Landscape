var marketSearches = angular.module("marketSearches",[]);

mktSearchController = marketSearches.controller("mktSearchController", ['$scope', function($scope){

    console.log('testing');

    $scope.params = [];

    var singleSearchParam = function() {
        this.search_term = "";
        this.property = ""
    }

    $scope.params.push(
        new singleSearchParam()
    );

    console.log($scope.params);

}]);