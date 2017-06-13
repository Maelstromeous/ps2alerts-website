app.controller('HomeVictoryController', function($scope, ConfigDataService, HomeVictoryStatisticsService) {
    $scope.today = new Date();
    $scope.victoryStats = HomeVictoryStatisticsService;
    $scope.config = ConfigDataService;

    $scope.victoryStats.init();
});
