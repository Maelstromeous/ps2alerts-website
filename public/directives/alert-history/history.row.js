app.directive('historyRow', function(HomeStatisticsService) {
    return {
        restrict: 'A',
        scope : {
            metrics: '=',
            config: '='
        },
        templateUrl: 'views/alert-history/history.row.html',
    };
});
