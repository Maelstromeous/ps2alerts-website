app.directive('projectStatus', function() {
    return {
        restrict: 'A',
        scope : {
            cardTitle:    '@',
            cardSubtitle: '@',
            project:      '='
        },
        templateUrl: 'views/common/partials/project.status.html',
    };
});
