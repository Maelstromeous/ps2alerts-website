app.controller('RealTimeMonitorController', function($scope, ConfigDataService, WebsocketService, $interval) {
    $scope.config    = ConfigDataService;
    $scope.websocket = WebsocketService;

    $scope.websocketDisabled = 1;
    $scope.message = 'DBG API is reporting incorrect territory values. Alert tracking has been disabled until this has been fixed.';
    $scope.messageCaption = 'Updated: 29th April 13:51 UTC';

    if ($scope.websocketDisabled === 0) {
        // Start the engines
        $scope.websocket.initWebSocket();
    }
});
