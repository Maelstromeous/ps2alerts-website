app.controller('SearchController', function($scope, SearchService) {
    $scope.type        = 'player';
    $scope.term        = '';
    $scope.placeholder = '';
    $scope.service = SearchService

    $scope.fireSearch = function() {
        console.log('Firing search');

        if ($scope.term.length > 1) {
            SearchService.search($scope.type, $scope.term);
        }
    }

    $scope.hide = function() {
        $scope.service.results = [];
        $scope.term = '';
        $scope.service.show = false;
    }

    $scope.$watch('type', function() {
        $scope.placeholder = 'Search ' + _.capitalize($scope.type) + 's';
    })
});
