app.controller('RealTimeMonitorController', function($scope, ConfigDataService, WebsocketService, $interval) {
    $scope.config    = ConfigDataService;
    $scope.websocket = WebsocketService;

    $scope.websocketDisabled = 0;
    $scope.message = '';
    $scope.messageCaption = '';

    if ($scope.websocketDisabled === 0) {
        // Start the engines
        $scope.websocket.initWebSocket();
    }

    $scope.simMiddlemanDown = function() {
        $scope.websocket.loaded = 0;
        $scope.websocket.middlemanDown = 1;
    };
});
