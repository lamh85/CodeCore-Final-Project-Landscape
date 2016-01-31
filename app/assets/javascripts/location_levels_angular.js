var locationLevelApp = angular.module("locationLevelApp",[]);

locationLevelController = locationLevelApp.controller("locationLevelController", ['$scope', '$http', function($scope, $http){

    // Tools
    // -----

    var sortByThread = function(a,b) {
        if (a.thread == b.thread) {
            return 0;
        } else if (a.thread > b.thread) {
            return 1;
        } else {
            return -1;
        }
    }

    // Other
    // -----

    var levelsRaw = [];
    $scope.levelsSegmented = {};

    var divideLevels = function(){
        var lastThreadNumber = 0;
        while (levelsRaw.length > 0) {
            // If this is a new thread number, then create new property in object
            if (levelsRaw[0].thread != lastThreadNumber) {
                $scope.levelsSegmented["thread" + levelsRaw[0].thread] = [];
                lastThreadNumber = levelsRaw[0].thread;
            }
            $scope.levelsSegmented["thread" + lastThreadNumber].push(levelsRaw[0]);
            levelsRaw.splice(0, 1);
        }
    }

    var sortLevels = function() {
        levelsRaw = levelsRaw.sort(sortByThread);
        divideLevels();
    }

    $http.get('../location_levels/get_all').then(function(response){
        levelsRaw = response.data;
        sortLevels();
    })

}]);

locationLevelController.directive('dragDir', function(){
    return {
        scope: false, // This defines the "scope" variable as the controller's "$scope"
        link: function(scope, element){
            // http://blog.parkji.co.uk/2013/08/11/native-drag-and-drop-in-angularjs.html
            $(element)
                .attr('draggable', 'true')
                .on('dragstart', function(){
                    console.log('drag starting');
                })
                .on('dragover', function(e){
                    if (e.preventDefault) e.preventDefault();
                    console.log('dragging over me!');
                })
                .on('drop', function(){
                    console.log('dropped! The levels are');
                    console.log(scope.levelsSegmented);
                    // console.log(scope);
                });
        }
    }
})