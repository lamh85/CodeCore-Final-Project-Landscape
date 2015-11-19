var marketSearches = angular.module("marketSearches",[]);

mktSearchController = marketSearches.controller("mktSearchController", ['$scope', '$http', function($scope, $http){


    $scope.options = [
        { display: "Product Category", value: "category" },
        { display: "Province", value: "province" },
        { display: "Country", value: "country" },
        { display: "Description", value: "description" }
    ];
    $scope.params = [];

    var singleSearchParam = function() {
        this.search_term = "something";
        this.property = "category";
    }

    $scope.addFilter = function() {
        $scope.params.push(
            new singleSearchParam()
        );        
    }
    $scope.addFilter();

    $scope.removeFilter = function() {
        $scope.params.splice(($scope.params.length - 1), 1);
    }

    $scope.search = function() {
        $http({
            method: 'GET',
            params: $scope.params,
            url: "../market_searches/results_v2"
        }).then(function successCallback(response){
            console.log(response.data);
        });
    }

}]);