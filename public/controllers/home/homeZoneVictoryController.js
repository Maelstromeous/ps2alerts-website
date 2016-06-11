app.controller('HomeZoneVictoryController', function($scope, HomeZoneVictoryService, ConfigDataService) {
    $scope.zoneStats = HomeZoneVictoryService;
    $scope.config = ConfigDataService;
    $scope.zoneStats.init();
    $scope.loaded = false;

    $scope.$on('zonesLoaded', function() {
        $scope.loaded = true;
        $scope.$apply(); // Fix for slow loading
        console.log($scope.zoneStats);
    });
});
