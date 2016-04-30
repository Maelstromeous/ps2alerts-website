app.controller('RealTimeMonitorController', function($scope, ConfigDataService, WebsocketService, $interval) {
    $scope.config    = ConfigDataService;
    $scope.websocket = WebsocketService;

    $scope.websocketDisabled = 0;
    $scope.message = 'DBG API is occasionally reporting incorrect territory values. Tracking may be inaccurate for some servers and continents (which appears to be seemingly random). Please report them as you see them. The results will be removed accordingly upon manual detection.';
    $scope.messageCaption = 'Updated: 30th April 15:51 UTC';

    if ($scope.websocketDisabled === 0) {
        // Start the engines
        $scope.websocket.initWebSocket();
    }
});
