app.directive('alertMapStats', function() {
    return {
        restrict: 'A',
        templateUrl: 'views/alert/map.html',
    };
});

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
