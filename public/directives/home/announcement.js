app.directive('homepageAnnouncement', function() {
    return {
        restrict: 'A',
        templateUrl: 'views/home/partials/announcement.html',
        link: function( $scope, elem, attrs ) {
            elem.ready(function(){
                $scope.$emit('ga-sync', '[homepage-announcement] .ga-event');
            });
        }
    };
});
