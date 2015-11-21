var marketSearches = angular.module("marketSearches",[]);

mktSearchController = marketSearches.controller("mktSearchController", ['$scope', '$http', function($scope, $http){

    $scope.options = [
        { display: "Product",           value: "product" },
        { display: "Product Category",  value: "category" },
        { display: "Province",          value: "province" },
        { display: "Country",           value: "country" },
        { display: "Description",       value: "description" }
    ];
    $scope.params = [];

    var singleSearchParam = function() {
        this.search_term =  "British Columbia";
        this.property =     "province";
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

    $scope.results = [];
    $scope.insertCommas = function(number) {
        return insertCommas(number);
    }
    $scope.search = function() {
        $http({
            method: 'GET',
            params: $scope.params,
            url: "../market_searches/results_v2"
        }).then(function successCallback(response){
            deactivateLoading();            
            $scope.results = response.data;
        });
    }

}]);