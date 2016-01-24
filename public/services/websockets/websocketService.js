app.service('WebsocketService', function($rootScope, $log, AlertStatisticsService, ConfigDataService) {
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
                    case 'alertStart': {
                        factory.addActive(message.data);
                        break;
                    }
                    case 'update': {
                        factory.updateActives(message);
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

    factory.addActive = function (messageData) {
        factory.parseAlertDataInitial(messageData, function(alert) {
            console.log("Starting Alert", alert);
            factory.actives[alert.id] = alert;

            // @todo Look into seeing if we can do this via an event upon element render. Timer will do for now.
            setTimeout(function() {
                setMonitorCountdown(alert.id);
            }, 1000);

            $rootScope.$apply();
        });
    };

    factory.updateActives = function (message) {
        factory.parseAlertDataUpdate(message.data, function(alert) {
            if (alert.defence === 0) {
                console.log("Logging capture", alert);
                factory.actives[alert.id].vs = alert.vs;
                factory.actives[alert.id].nc = alert.nc;
                factory.actives[alert.id].tr = alert.tr;
                factory.actives[alert.id].cutoff = 100 - alert.vs - alert.nc - alert.tr;
                $rootScope.$apply();
            }
        });
    };

    factory.endActive = function (message) {
        factory.parseAlertDataEnd(message.data, function(alert) {
            console.log("Ending Alert: ", alert);

            delete factory.actives[alert.id];

            AlertStatisticsService.increaseAlertTotal();
            AlertStatisticsService.increaseVictories(alert.server, alert.winner);

            if (alert.domination === 1) {
                AlertStatisticsService.increaseDominationTotal();
                AlertStatisticsService.increaseDominations(alert.server, alert.winner);
            }

            $rootScope.$apply();
        });
    };

    // Also handles starts as it's the same fields
    factory.parseAlertDataInitial = function (alert, callback) {
        var time = new Date().getTime();
        var remainingJS = (parseInt(alert.remaining) * 1000);
        var realEnd = (time + remainingJS) - 1; // - 1 because of setTimeout

        var obj = {
            id:        parseInt(alert.resultID),
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

    factory.parseAlertDataEnd = function (alert, callback) {
        callback({
            id:         parseInt(alert.resultID),
            ended:      parseInt(alert.endTime),
            vs:         parseInt(alert.controlVS),
            nc:         parseInt(alert.controlNC),
            tr:         parseInt(alert.controlTR),
            server:     parseInt(alert.world),
            zone:       parseInt(alert.zone),
            domination: parseInt(alert.domination),
            winner:     alert.winner.toLowerCase()
        });
    };

    factory.addAlertTest = function() {
        var timestamp = new Date().getTime();
        timestamp = timestamp / 1000;

        var testData = {
            startTime: timestamp,
            endTime:   timestamp + 5399, // - 1 because of setTimeout
            world:     10,
            zone:      2,
            resultID:  12345,
            controlVS: 33,
            controlNC: 33,
            controlTR: 33,
            remaining: 5400
        };
        factory.addActive(testData);
    };

    factory.endAlertTest = function() {
        var testData = {
            data: {
                controlNC: "37",
                controlTR: "27",
                controlVS: "35",
                domination: 1,
                endtime: "1453570024",
                resultID: 12345,
                winner: "NC",
                world: "10",
                zone: "2"
            }
        };

        factory.endActive(testData);
    };

    factory.updateAlertTest = function() {
        var testData = {
            data: {
                controlNC: "37",
                controlTR: "27",
                controlVS: "35",
                domination: 1,
                endtime: "1453570024",
                resultID: 12345,
                winner: "NC",
                world: "10",
                zone: "2"
            }
        };

        factory.endActive(testData);
    };

    return factory;
});
