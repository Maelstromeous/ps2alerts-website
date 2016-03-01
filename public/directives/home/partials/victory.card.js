app.directive('homeFactionCard', function(HomeStatisticsService) {
    return {
        restrict: 'A',
        scope : {
            cardClass: '@',
            cardTitle: '@',
            faction:   '@',
        },
        link:function(scope) {
            scope.stats = HomeStatisticsService.totals;
        },
        templateUrl: 'views/home/partials/faction.card.html',
    };
});
