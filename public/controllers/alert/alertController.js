app.controller('AlertController', function(
    $scope,
    AlertMetricsService,
    $document
) {
    $scope.alert = AlertMetricsService;
    // Instantiate the service
    $scope.alert.init();
});
