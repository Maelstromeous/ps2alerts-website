app.directive('homeFilters', function($filter) {
    return {
        restrict: 'E',
        scope: {
            filters: '=',
            config: '=',
            show: '='
        },
        templateUrl: 'views/home/filters.html',
        link: function($scope, elem) {
            elem.ready(function() {
                $scope.filters.dateFrom = $filter('date')($scope.filters.dateFrom, 'dd-MMM-yyyy');
                $scope.filters.dateTo = $filter('date')($scope.filters.dateTo, 'dd-MMM-yyyy');
                $('.datepicker').pickadate({
                    selectMonths: true,
                    selectYears: true,
                    today: 'Today',
                    clear: false,
                    close: 'Ok',
                    format: 'dd-mmm-yyyy',
                    min: new Date(2014, 9, 29),
                    max: new Date()
                });
                $scope.$emit('ga-sync', '[filters] .ga-event');
            });
        }
    };
});