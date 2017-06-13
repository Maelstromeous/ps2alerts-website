app.controller('HomeCombatController', function(
    $scope,
    ConfigDataService,
    HomeCombatStatisticsService
) {
    $scope.today = new Date();
    $scope.combatStats = HomeCombatStatisticsService;

    $scope.combatStats.init();
});
