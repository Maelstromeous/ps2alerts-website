app.controller('VictoryController', function($scope, ConfigDataService, AlertStatisticsService) {
    $scope.today = new Date();
    $scope.alertStats = AlertStatisticsService;
    $scope.config = ConfigDataService;
});

app.controller('ServerVictoryController', function($scope, ServerStatisticsService) {
    $scope.serverStats = ServerStatisticsService;
});
