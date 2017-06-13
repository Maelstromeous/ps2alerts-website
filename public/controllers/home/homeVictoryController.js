app.controller('HomeVictoryController', function(
    $scope,
    ConfigDataService,
    HomeVictoryStatisticsService
) {
    $scope.today = new Date();
    $scope.victoryStats = HomeVictoryStatisticsService;
    $scope.config = ConfigDataService;

    $scope.victoryStats.init();

    // For some reason tabs don't init correctly, we have to do it here
    $(document).ready(function() {
        $('ul.tabs').tabs();
    });
});
