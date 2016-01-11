app.controller('VictoryController', function($scope, ENV, AlertStatisticsService) {
    $scope.today = new Date();

    $scope.AlertStats = AlertStatisticsService;
});
