app.controller('RealTimeMonitorController', function($scope, ConfigDataService, WebsocketService, $interval) {
    $scope.config    = ConfigDataService;
    $scope.websocket = WebsocketService;

    // Start the engines
    $scope.websocket.initWebSocket();
});
