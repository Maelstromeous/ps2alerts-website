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
