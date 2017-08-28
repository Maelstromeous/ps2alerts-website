app.directive('filters', function() {
    return {
        restrict: 'E',
        scope: {
            filters: '=',
            config: '='
        },
        templateUrl: 'views/home/filters.html',
        link: function($scope, elem) {
            elem.ready(function() {
                $('.datepicker').pickadate({
                    selectMonths: true,
                    selectYears: true,
                    today: 'Today',
                    clear: false,
                    close: 'Ok',
                    format: 'dd-mmm-yyyy',
                    min: $scope.filters.dateFrom,
                    max: $scope.filters.dateTo
                });
            });
        }
    };
});