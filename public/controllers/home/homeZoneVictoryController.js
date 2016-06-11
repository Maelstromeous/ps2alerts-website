app.controller('HomeZoneVictoryController', function($scope, HomeZoneVictoryService) {
    $scope.zoneStats = HomeZoneVictoryService;
    $scope.zoneStats.init();

    $scope.$on('zonesLoaded', function() {
        $scope.$apply(); // Fix for slow loading
        console.log($scope.zoneStats);
    })

    $scope.calculateServerEmpireStats = function() {

    }
});
