app.controller('AlertHistoryController', function($scope, ConfigDataService, AlertHistoryService) {
    $scope.data = AlertHistoryService;
    $scope.config = ConfigDataService;
});
