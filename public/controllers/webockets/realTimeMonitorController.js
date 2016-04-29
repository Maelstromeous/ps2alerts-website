app.controller('RealTimeMonitorController', function($scope, ConfigDataService, WebsocketService, $interval) {
    $scope.config    = ConfigDataService;
    $scope.websocket = WebsocketService;

    $scope.websocketDisabled = 1;
    $scope.message = 'DBG API is reporting incorrect territory values. Tracking has been disabled until this is resolved.';

    if ($scope.websocketDisabled === 0) {
        // Start the engines
        $scope.websocket.initWebSocket();
    }
});
