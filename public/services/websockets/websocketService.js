app.service('WebsocketService', function(
    $rootScope,
    $document,
    HomeStatisticsService,
    AlertHistoryService,
    ConfigDataService
) {
    var factory = {};

    factory.webSocket = {};
    factory.loaded = 0;
    factory.count = 0;
    factory.middlemanDown = 0;

    factory.actives = {};

    factory.initWebSocket = function() {
        console.log('Connecting websocket...');

        $("#websocket-status").removeClass().addClass('websocket-connecting');

        factory.webSocket = new WebSocket('ws://api.ps2alerts.com:1337?apikey=692e01b167f4c5c28cdc95389f038393');

        factory.webSocket.onopen = function () {
            console.log('Websocket Connected');
            factory.authenticate();
            factory.checkMiddleman();
        };

        factory.webSocket.onmessage = function (rawMessage) {
            var message = factory.parse(rawMessage);
            factory.handleWebsocketMessage(message);
        };

        factory.webSocket.onclose = function() {
            $("#websocket-status").removeClass().addClass('websocket-disconnected');
            setTimeout(function() {
                console.log("Websocket Connection Lost... Reconnecting");
                return factory.initWebSocket();
            }, 2500);
        };
    };

    factory.authenticate = function () {
        console.log('Authenticating...');
        factory.webSocket.send('{"payload":{"action":"alertStatus"}}');
        $("#websocket-status").removeClass().addClass('websocket-connected');
    };

    factory.checkMiddleman = function () {
        console.log('Checking middleman...');
        factory.webSocket.send('{"payload":{"action":"middlemanStatus"}}');
        console.log('Sent middleman...');
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
                    case 'middlemanStatus': {
                        factory.parseMiddleman(message);
                        break;
                    }
                }
            }
        }
    };

    factory.initActives = function (message) {
        factory.loaded = 1;
        angular.forEach(message.data, function(server) {
            angular.forEach(server, function(alert) {
                factory.addActive(alert);
            });
        });
    };

    factory.addActive = function (messageData) {
        factory.parseAlertDataInitial(messageData, function(alert) {
            factory.actives[alert.id] = alert;
            factory.count++;

            // @todo Look into seeing if we can do this via an event upon element render. Timer will do for now.
            setTimeout(function() {
                setMonitorCountdown(alert.id);
            }, 1);

            $rootScope.$apply();
        });
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

    factory.endActive = function (message) {
        factory.parseAlertDataEnd(message.data, function(alert) {
            delete factory.actives[alert.id];
            factory.count--;

            HomeStatisticsService.increaseAlertTotal();
            HomeStatisticsService.increaseVictories(alert.server, alert.winner);

            if (alert.domination === 1) {
                HomeStatisticsService.increaseDominationTotal();
                HomeStatisticsService.increaseDominations(alert.server, alert.winner);
            }

            AlertHistoryService.appendAlert(alert);

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

    factory.parseMiddleman = function(message) {
        console.log('middleman value', message);
        if (message.value == '0') {
            $("#websocket-status").removeClass().addClass('websocket-middleman-fail');

            factory.middlemanDown = 1;
            factory.loaded = 0;
        }

        if (message.value == '1') {
            if ( $("#websocket-status").hasClass('websocket-middleman-fail') ) {
                $("#websocket-status").removeClass().addClass('websocket-connected');
            }
            factory.middlemanDown = 0;
            factory.loaded = 1;
        }
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
        console.log('End alert test');
        var testData = {
            data: {
                controlNC: "37",
                controlTR: "27",
                controlVS: "35",
                domination: 0,
                endTime: "1453570024",
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
