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
    $scope.levelsSegmented = {};

    var divideLevels = function(){
        var lastThreadNumber = 0;
        while (levelsRaw.length > 0) {
            // If this is a new thread number, then create new property in object
            if (levelsRaw[0].thread != lastThreadNumber) {
                $scope.levelsSegmented["thread" + levelsRaw[0].thread] = [levelsRaw[0]];
            } else {
                $scope.levelsSegmented["thread" + lastThreadNumber].push([levelsRaw[0]]);
            }
            lastThreadNumber = levelsRaw[0].thread;
            levelsRaw.splice(0, 1);
            // $scope.levelsSegmented.push()
        }
    }

    var sortLevels = function() {
        levelsRaw = levelsRaw.sort(sortByThread);
        window.debugVar = levelsRaw;
    }

    $http.get('../location_levels/get_all').then(function(response){
        levelsRaw = response.data;
        console.log('GET successful');
        sortLevels();
    })

    // Create an array for each thread

}]);