app.controller('AlertController', function(
    $scope,
    $q,
    AlertMetricsService
) {
    $scope.alert = AlertMetricsService;
    // Instantiate the service
    $scope.alert.init();
});
