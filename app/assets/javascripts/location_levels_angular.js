var locationLevelApp = angular.module("locationLevelApp",[]);

locationLevelController = locationLevelApp.controller("locationLevelController", ['$scope', '$http', function($scope, $http){

    $scope.levels = [];
    $http.get('../location_levels/get_all').then(function(data){
        console.log('data retrieved!');
        window.debugVar = data;
    })

    console.log('I am from location_level_angular');
}]);