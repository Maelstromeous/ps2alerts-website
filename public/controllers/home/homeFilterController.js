app.controller('HomeFilterController', function(
    $scope,
    ConfigDataService,
    HomeVictoryStatisticsService,
    HomeCombatStatisticsService,
    HomeZoneVictoryService,
    HomeTimelineService
) {
    $scope.filters = {
        dateFrom: new Date(2014, 9, 29), // October is 9 not 10 because #jslogic
        dateTo: new Date(),
        servers: [1,10,13,17,25,1000,2000],
        zones: [2,4,6,8],
        brackets: ['MOR','AFT','PRI']
    };

    $scope.config = ConfigDataService;
    $scope.show = false;

    $scope.applyFilter = function() {
        HomeVictoryStatisticsService.resetData();
        HomeVictoryStatisticsService.applyFilter($scope.filters);
    };

    $scope.clearFilter = function() {
        $scope.filters.servers  = [];
        $scope.filters.zones    = [];
        $scope.filters.brackets = [];
    };

    $scope.showAll = function() {
        $scope.filters.dateFrom = new Date(2014, 9, 29);
        $scope.filters.dateTo   = new Date();
        $scope.filters.servers  = [1,10,13,17,25,1000,2000];
        $scope.filters.zones    = [2,4,6,8];
        $scope.filters.brackets = ['MOR','AFT','PRI'];
        HomeVictoryStatisticsService.applyFilter($scope.filters);
    };

    $scope.toggleFilters = function(type, selection) {
        $scope.initCheck(type);

        var index = $scope.filters[type].indexOf(selection);

        if (index > -1) {
            $scope.filters[type].splice(index, 1); // Remove element from array
        } else {
            $scope.filters[type].push(selection);
        }
    };

    $scope.initCheck = function(type) {
        if ($scope.inits[type] === false) {
            $scope.filters[type] = []; // Clear all selections
            $scope.inits[type] = true;
        }
    };

    // Show initial data
    $scope.showAll();
});
