app.service('WebsocketService', function($rootScope, $log, AlertStatisticsService) {
    var factory = {};

    factory.webSocket = {};
    factory.authed = 0;

    factory.actives = {};

    factory.initWebSocket = function() {
        console.log('Connecting websocket...');
        factory.webSocket = new WebSocket('ws://api.ps2alerts.com:1337?apikey=692e01b167f4c5c28cdc95389f038393');

        factory.webSocket.onopen = function () {
            console.log('Websocket Connected');
            factory.authenticate();
        };

        factory.webSocket.onmessage = function (rawMessage) {
            var message = factory.parse(rawMessage);
            factory.handleWebsocketMessage(message);
        };
    };

    factory.authenticate = function () {
        console.log('Authenticating...');
        factory.webSocket.send('{"payload":{"action":"alertStatus"}}');
    };

    factory.parse = function(rawMessage) {
        var message = null;

        try {
            message = JSON.parse(rawMessage.data);
        } catch(e) {
            console.log('Websocket JSON parse fail!', e);
        }

        if (typeof message === null) {
            return false;
        }

        return message;
    };

    factory.handleWebsocketMessage = function (message) {
        if (message !== null) {
            if (message.messageType !== 'keepalive') {
                console.log('Websocket message:', message);
            }

            if (typeof message.messageType !== 'undefined') {
                switch (message.messageType) {
                    case 'update': {
                        factory.updateActives(message);
                        break;
                    }
                    case 'alertStart': {
                        factory.addActive(message.data);
                        break;
                    }
                    case 'alertEnd': {
                        factory.endActive(message);
                        break;
                    }
                    case 'alertStatus': {
                        factory.initActives(message);
                        break;
                    }
                }
            }
        }
    };

    factory.initActives = function (message) {
        angular.forEach(message.data, function(server) {
            angular.forEach(server, function(alert) {
                factory.addActive(alert);
            });
        });

        $log.log(factory.actives);
    };

    factory.updateActives = function (message) {
        factory.parseAlertDataUpdate(message.data, function(alert) {
            if (alert.defence === 0) {
                factory.actives[alert.id].vs = alert.vs;
                factory.actives[alert.id].nc = alert.nc;
                factory.actives[alert.id].tr = alert.tr;
                factory.actives[alert.id].cutoff = 100 - alert.vs - alert.nc - alert.tr;
                $rootScope.$apply();
            }
        });
    };

    factory.addActive = function (messageData) {
        factory.parseAlertDataInitial(messageData, function(alert) {
            factory.actives[alert.id] = alert;

            // @todo Look into seeing if we can do this via an event upon element render. Timer will do for now.
            setTimeout(function() {
                setMonitorCountdown(alert.id);
            }, 1000);

            $rootScope.$apply();
        });
    };

    factory.endActive = function (message) {
        console.log('Ending alert: ', message.data);
        factory.parseAlertDataUpdate(message.data, function(alert) {
            delete factory.actives[alert.id];

            AlertStatisticsService.increaseAlertTotal();
            $rootScope.$apply();
            console.log("Ended alert", alert.id);
        });
    };

    factory.parseAlertDataInitial = function (alert, callback) {
        var time = new Date().getTime();
        var remainingJS = (parseInt(alert.remaining) * 1000);
        var realEnd = (time + remainingJS);

        var obj = {
            id:   parseInt(alert.resultID),
            started:   parseInt(alert.startTime),
            ends:      parseInt(alert.endTime),
            countdown: realEnd,
            vs:        parseInt(alert.controlVS),
            nc:        parseInt(alert.controlNC),
            tr:        parseInt(alert.controlTR),
            server:    parseInt(alert.world),
            zone:      parseInt(alert.zone)
        };

        callback(obj);
    };

    factory.parseAlertDataUpdate = function (alert, callback) {
        callback({
            id:      parseInt(alert.resultID),
            vs:      parseInt(alert.controlVS),
            nc:      parseInt(alert.controlNC),
            tr:      parseInt(alert.controlTR),
            server:  parseInt(alert.world),
            zone:    parseInt(alert.zone),
            defence: parseInt(alert.defence)
        });
    };

    factory.addNewAlert = function() {
        var testData = {};
        factory.addActive(testData);
    };

    return factory;
});
