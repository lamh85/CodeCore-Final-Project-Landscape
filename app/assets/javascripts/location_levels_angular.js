var locationLevelApp = angular.module("locationLevelApp",[]);

locationLevelController = locationLevelApp.controller("locationLevelController", ['$scope', '$http', function($scope, $http){

    // Model
    // -----
    var levelsRaw = [];
    $scope.levelsSegmented = {};
    var draggedElement = {};
    var draggedElementData = {};
    var draggedIndex = {};
    var dropElement = {};
    var dropIndex = {};
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

    var getIndex = function(element) {
        return $(element).closest('.level').data('index');
    }

    var shiftArray = function() {
        $scope.levelsSegmented[threadAffected].splice(draggedIndex, 1);
        $scope.levelsSegmented[threadAffected].splice(dropIndex, 0, draggedElementData);
    }

    $scope.handleDrag = function() {
        draggedElement = event.target;
        draggedIndex = getIndex(draggedElement);
        threadAffected = $(event.target).closest('.level').data('thread');
        draggedElementData = $scope.levelsSegmented[threadAffected][draggedIndex];
    }

    $scope.handleDragover = function() {
        dropElement = event.target;
        dropIndex = getIndex(dropElement);
    }

    $scope.handleDrop = function() {
        if (threadAffected == $(dropElement).closest('.level').data('thread')) {
            $scope.levelsSegmented[threadAffected].splice(draggedIndex, 1);
            $scope.levelsSegmented[threadAffected].splice(dropIndex, 0, draggedElementData);
        }
    }

    // ng-click
    // --------

    /*
    $scope.addLevel = function(threadName) {
        $scope.levelsSegmented[threadName].push();
    }
    */

}]);

locationLevelController.directive('dragDir', function(){
    return {
        scope: {
            dirDragAtt: "&",
            dirDragoverAtt: "&",
            dirDropAtt: "&"
        },
        link: function(scope, element){
            $(element)
                .attr('draggable', 'true')
                .on('dragstart', function(){
                    scope.$apply('dirDragAtt()');
                })
                .on('dragover', function(event){
                    if (event.preventDefault) event.preventDefault();
                    scope.$apply('dirDragoverAtt()');
                    $(event.target).closest('.tag').addClass('dragged-over');
                })
                .on('dragleave', function(event){
                    $(event.target).closest('.tag').removeClass('dragged-over');
                })
                .on('drop', function(event){
                    scope.$apply('dirDropAtt()');
                    $('*').removeClass('dragged-over');
                });
        }
    }
});