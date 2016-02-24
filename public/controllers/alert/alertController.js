app.controller('AlertController', function(
    $scope,
    $q,
    AlertMetricsService,
    DTOptionsBuilder,
    DTColumnBuilder,
    DTColumnDefBuilder
) {
    $scope.alert = AlertMetricsService;
    // Instantiate the service
    $scope.alert.init();

    $scope.leaderboards = {};
    $scope.leaderboards.players = {};
    $scope.leaderboards.players.dtInstance = {};

    $scope.dtOptions =
        DTOptionsBuilder.newOptions()
            .withPaginationType('full_numbers')
            .withDisplayLength(6);
    $scope.dtColumnDefs = [
        DTColumnDefBuilder.newColumnDef(0),
        DTColumnDefBuilder.newColumnDef(1),
        DTColumnDefBuilder.newColumnDef(2),
        DTColumnDefBuilder.newColumnDef(3),
        DTColumnDefBuilder.newColumnDef(4),
        DTColumnDefBuilder.newColumnDef(5),
        DTColumnDefBuilder.newColumnDef(6)
    ];
});
