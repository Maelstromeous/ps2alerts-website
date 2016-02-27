app.controller('HomeVictoryController', function($scope, ConfigDataService, HomeStatisticsService) {
    $scope.today = new Date();
    $scope.alertStats = HomeStatisticsService;
    $scope.config = ConfigDataService;
});

app.controller('HomeTimelineController', function ($scope) {

});

app.controller('HomeZoneVictoryController', function($scope, HomeZoneStatisticsService) {
    $scope.zoneStats = HomeZoneStatisticsService;
});
