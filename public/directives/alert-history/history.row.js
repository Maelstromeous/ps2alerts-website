app.directive('historyRow', function(AlertStatisticsService) {
    return {
        restrict: 'A',
        scope : {
            metrics: '=',
            config: '='
        },
        templateUrl: 'views/alert-history/history.row.html',
    };
});
