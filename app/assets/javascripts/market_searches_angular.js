var marketSearches = angular.module("marketSearches",[]);

mktSearchController = marketSearches.controller("mktSearchController", ['$scope', function($scope){

    console.log('testing');

    $scope.params = [];

    var singleSearchParam = function() {
        this.search_term = "";
        this.property = "";
    }

    $scope.addFilter = function() {
        console.log('adding filter');
        $scope.params.push(
            new singleSearchParam()
        );        
    }
    $scope.addFilter();

    $scope.removeFilter = function() {
        console.log('removing');
    }

    $scope.search = function() {
        console.log($scope.params);
    }

    console.log($scope.params);

}]);