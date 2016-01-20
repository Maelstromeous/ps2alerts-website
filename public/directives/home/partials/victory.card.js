app.directive('homeAlertMetricCard', function(AlertStatisticsService) {
    return {
        restrict: 'A',
        scope : {
            cardTitle: '@',
            metric:    '@'
        },
        templateUrl: 'views/home/partials/alertmetric.card.html',
    };
});

app.directive('homeFactionCard', function(AlertStatisticsService) {
    return {
        restrict: 'A',
        scope : {
            cardClass: '@',
            cardTitle: '@',
            faction:   '@',
        },
        link:function(scope) {
            scope.stats = AlertStatisticsService.totals;
        },
        templateUrl: 'views/home/partials/faction.card.html',
    };
});
