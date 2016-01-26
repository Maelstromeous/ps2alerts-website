app.controller('VictoryController', function($scope, ConfigDataService, AlertStatisticsService) {
    $scope.today = new Date();
    $scope.alertStats = AlertStatisticsService;
    $scope.config = ConfigDataService;
});

app.controller('ZoneVictoryController', function($scope, ZoneStatisticsService) {
    $scope.zoneStats = ZoneStatisticsService;
});
