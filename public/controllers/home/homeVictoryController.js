app.controller('HomeVictoryController', function($scope, ConfigDataService, HomeStatisticsService) {
    $scope.today = new Date();
    $scope.alertStats = HomeStatisticsService;
    $scope.config = ConfigDataService;

    $scope.alertStats.init();
});
