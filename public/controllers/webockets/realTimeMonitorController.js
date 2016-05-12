app.controller('RealTimeMonitorController', function($scope, ConfigDataService, WebsocketService, $interval) {
    $scope.config    = ConfigDataService;
    $scope.websocket = WebsocketService;

    $scope.websocketDisabled = 0;
    $scope.message = 'Indar territory values are being reported by DBG incorrectly due to the Indar base patch. Indar alerts won\'t be tracked for now.';
    $scope.messageCaption = 'Updated: 12th May 22:23 UTC';

    if ($scope.websocketDisabled === 0) {
        // Start the engines
        $scope.websocket.initWebSocket();
    }
});
