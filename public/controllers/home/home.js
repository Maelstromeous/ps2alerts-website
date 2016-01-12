app.controller('VictoryController', function($scope, ENV, AlertStatisticsService) {
    $scope.today = new Date();

    $scope.AlertStats = AlertStatisticsService;
});

app.controller('ServerVictoryController', function($scope, ENV, ServerStatisticsService) {
    $scope.ServerStats = ServerStatisticsService;
});
