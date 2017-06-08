app.service('AlertWebsocketService', function(
    $rootScope,
    $document,
    ConfigDataService
) {
    var factory = {};
    factory.id = 0;

    factory.webSocket = {};
    factory.config = ConfigDataService;

    // If the user navigates away from the page, close the websocket
    $rootScope.$on('$routeChangeStart', function() {
        if (factory.webSocket) {
            factory.disconnect();
        }
    });

    factory.initAndSubscribe = function(resultID) {
        factory.webSocket = new WebSocket('ws://' + ConfigDataService.websocketUrl);

        factory.id = resultID;

        factory.webSocket.onopen = function() {
            var message = {
                payload: {
                    action: 'subscribe',
                    resultID: resultID,
                }
            };
            factory.webSocket.send(JSON.stringify(message));
        };

        factory.webSocket.onmessage = function(rawMessage) {
            factory.handleWebsocketMessage(factory.parse(rawMessage));
        };

        factory.webSocket.onclose = function() {
            console.log('Websocket closed');
        };
    };

    factory.parse = function(rawMessage) {
        var message = null;

        try {
            message = JSON.parse(rawMessage.data);
        } catch (e) {
            console.log('Websocket JSON parse fail!', e);
        }

        if (typeof message === null) {
            return false;
        }

        return message;
    };

    factory.handleWebsocketMessage = function(message) {
        if (message !== null) {
            if (typeof message.messageType !== 'undefined') {
                console.log('messageType', message.messageType);
                switch (message.messageType) {
                    case 'subscribed':
                        factory.timeSync();
                        break;
                    case 'timeSync':
                    case 'timeSyncWait': {
                        $rootScope.$broadcast('timeSync', message);
                        break;
                    }
                    case 'combat': {
                        $rootScope.$broadcast('combatMessage', message);
                        break;
                    }
                    case 'facility': {
                        $rootScope.$broadcast('facilityMessage', message);
                        break;
                    }
                    case 'alertEnd': {
                        $rootScope.$broadcast('alertEnd', message);
                        break;
                    }
                }
            }
        }
    };

    factory.timeSync = function() {
        var time = new Date().getTime() / 1000;

        var message = {
            payload: {
                action: 'timesync',
                time: time,
                resultID: factory.id,
                mode: 'end'
            }
        };

        factory.webSocket.send(JSON.stringify(message));
    };

    factory.disconnect = function() {
        factory.webSocket.close();
        factory.webSocket = {};
    };

    return factory;
});
