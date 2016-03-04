app.directive('projectStatus', function() {
    return {
        restrict: 'A',
        scope : {
            cardTitle:    '@',
            cardSubtitle: '@',
            sizing:       '@',
            project:      '='
        },
        templateUrl: 'views/common/partials/project.status.html',
        link: function( $scope, elem, attrs ) {
            elem.ready(function(){
                $scope.$emit('project-status');
                $scope.$emit('ga-sync', '#project-status .ga-event');
            });
        }
    };
});
