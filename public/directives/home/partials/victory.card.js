app.directive('homeEmpireCard', function(AlertStatisticsService) {
    return {
        restrict: 'A',
        scope : {
            empire: '@',
            cardClass: '@',
            cardTitle: '@'
        },
        templateUrl: 'views/home/partials/empire.card.html',
        link:function(scope) {
            scope.AlertStats = AlertStatisticsService;
        }
    };
});

app.directive('homeAlertMetricCard', function(AlertStatisticsService) {
    return {
        restrict: 'A',
        scope : {
            cardTitle: '@',
            metric: '@'
        },
        templateUrl: 'views/home/partials/alertmetric.card.html',
        link:function(scope) {
            scope.AlertStats = AlertStatisticsService;
        }
    };
});
