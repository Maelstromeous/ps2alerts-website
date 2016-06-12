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
