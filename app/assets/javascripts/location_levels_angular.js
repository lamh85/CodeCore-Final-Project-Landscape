var locationLevelApp = angular.module("locationLevelApp",[]);

locationLevelController = locationLevelApp.controller("locationLevelController", ['$scope', '$http', function($scope, $http){

    var sortByThread = function(a,b) {
        if (a.thread == b.thread) {
            return 0;
        } else if (a.thread > b.thread) {
            return 1;
        } else {
            return -1;
        }
    }

    var levelsRaw = [];
    $scope.levelsSegmented = [];

    var divideLevels = function() {
        levelsRaw = levelsRaw.sort(sortByThread);
    }

    $http.get('../location_levels/get_all').then(function(response){
        levelsRaw = response.data;
        console.log('GET successful');
    })

    // Create an array for each thread

}]);