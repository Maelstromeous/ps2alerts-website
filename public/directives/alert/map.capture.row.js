app.directive('alertMapCaptureRow', function() {
    return {
        restrict: 'A',
        scope : {
            capture: '=',
            config: '='
        },
        templateUrl: 'views/alert/partials/map.log.row.html',
    };
});
