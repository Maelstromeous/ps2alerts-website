app.directive('homeFactionCard', function(AlertStatisticsService) {
    return {
        restrict: 'A',
        scope : {
            faction: '@',
            cardClass: '@',
            cardTitle: '@'
        },
        templateUrl: 'views/home/partials/faction.card.html',
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
