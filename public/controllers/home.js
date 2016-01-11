app.controller('VictoryController', function($scope, ENV, AlertStatisticsService) {
    $scope.today = new Date();

    $scope.incrementTotal = function(by) {
        AlertStatisticsService.incrementTotal(by);
    };

    $scope.alertTotal = AlertStatisticsService.total;
});
