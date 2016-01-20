app.controller('VictoryController', function($scope, AlertStatisticsService) {
    $scope.today = new Date();

    $scope.AlertStats = AlertStatisticsService;
});

app.controller('ServerVictoryController', function($scope, ServerStatisticsService) {
    $scope.ServerStats = ServerStatisticsService;
});
