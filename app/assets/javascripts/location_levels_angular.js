var locationLevelApp = angular.module("locationLevelApp",[]);

locationLevelController = locationLevelApp.controller("locationLevelController", ['$scope', '$http', function($scope, $http){

    // Model
    // -----
    var levelsRaw = [];
    $scope.levelsSegmented = {};
    var draggedElement = {};
    var dropTarget = {};
    var threadAffected = {};

    // Initialize data
    // ---------------

    var sortByThread = function(a,b) {
        if (a.thread == b.thread) {
            return 0;
        } else if (a.thread > b.thread) {
            return 1;
        } else {
            return -1;
        }
    }

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

    // Drag and drop functions
    // -----------------------

    $scope.shiftArray = function() {
        if ($(draggedElement).data('index') < $(dropTarget).data('index')) {
            /*
            element dragged element target  element
            element element target  dragged element
        } else {
            element target  element dragged element
            element dragged target  element element
            */
        }
    }

    $scope.handleDrag = function() {
        draggedElement = event.target;
        threadAffected = $(event.target).data('thread');
    }

    $scope.handleDrop = function() {
        dropTarget = event.target;
        if (threadAffected == $(dropTarget).closest('.level').data('thread')) {
            console.log('correct thread!');
        } else {
            console.log('wrong thread!');
        }
    }

}]);

locationLevelController.directive('dragDir', function(){
    return {
        scope: {
            dirDragAtt: "&",
            dirDropAtt: "&"
        },
        link: function(scope, element){
            // http://blog.parkji.co.uk/2013/08/11/native-drag-and-drop-in-angularjs.html
            $(element)
                .attr('draggable', 'true')
                .on('dragstart', function(){
                    scope.$apply('dirDragAtt()');
                })
                .on('dragover', function(e){
                    if (e.preventDefault) e.preventDefault();
                })
                .on('drop', function(event){
                    scope.$apply('dirDropAtt()');
                });
        }
    }
});