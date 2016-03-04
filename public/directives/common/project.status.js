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
    };
});
