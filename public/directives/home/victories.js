app.directive('homeVictories', function() {
    return {
        restrict: 'A',
        templateUrl: 'views/home/victories.html'
    }
});

app.directive('homeVictoryBreakdowns', function() {
    return {
        restrict: 'A',
        templateUrl: 'views/home/victory.breakdowns.html',
        link: function( $scope, elem, attrs ) {
            elem.ready(function(){
                // $scope.$emit('ga-sync', '#combat-leaderboards .ga-event');
            });
        }
    };
});

app.directive('homeFactionCard', function(HomeVictoryStatisticsService) {
    return {
        restrict: 'A',
        scope : {
            cardClass: '@',
            cardTitle: '@',
            faction:   '@',
        },
        link:function(scope) {
            scope.stats = HomeVictoryStatisticsService.totals;
        },
        templateUrl: 'views/home/partials/faction.card.html',
    };
});

app.directive('homeVictoryTimeline', function() {
    return {
        restrict: 'A',
        templateUrl: 'views/home/victory.timeline.html',
        link: function( $scope, elem, attrs ) {
            elem.ready(function(){
                // $scope.$emit('ga-sync', '#combat-leaderboards .ga-event');
            });
        }
    };
});
