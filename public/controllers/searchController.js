app.controller('SearchController', function($scope, SearchService) {
    $scope.type        = 'player';
    $scope.term        = '';
    $scope.placeholder = '';
    $scope.service = SearchService;

    $scope.timeout = null;

    $scope.fireSearch = function() {
        console.log('Firing search');

        if ($scope.term.length > 1) {
            SearchService.search($scope.type, $scope.term);
        }
    };

    $scope.hide = function() {
        $scope.service.results = [];
        $scope.term = '';
        $("#search-results").fadeOut();
    };

    $scope.$watch('type', function() {
        $scope.placeholder = 'Search ' + _.capitalize($scope.type) + 's';
    });

    $scope.$on('showSearchResults', function() {
        $("#search-results").fadeIn();
    });

    $(document).on('click', function (e) {
        if ($(e.target).closest("#site-search").length === 0) {
            $scope.hide();
        }
    });
});
