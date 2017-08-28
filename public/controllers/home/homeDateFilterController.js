app.controller('HomeDateFilterController', function(
    $scope,
    ConfigDataService,
    HomeCombatStatisticsService,
    HomeZoneVictoryService,
    HomeTimelineService
) {
    $scope.filters = {
        dateFrom: new Date(2014, 9, 29), // October is 9 not 10 because #jslogic
        dateTo: new Date()
    };
    $scope.server = '';
    $scope.zone = '';

    $scope.config = ConfigDataService;
});
