app.service('WebsocketService', function($log, AlertStatisticsService) {
    var factory = {};

    factory.webSocket = {};
    factory.authed = 0;

    factory.actives = {};

    factory.initWebSocket = function() {
        console.log('Connecting websocket...');
        factory.webSocket = new WebSocket('ws://212.71.244.253:1337?apikey=692e01b167f4c5c28cdc95389f038393');

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
        var alert = factory.parseAlertDataUpdate(message.data);

        if (alert.defence === 0) {
            factory.actives[alert.server][alert.zone].vs = alert.vs;
            factory.actives[alert.server][alert.zone].nc = alert.nc;
            factory.actives[alert.server][alert.zone].tr = alert.tr;
            factory.actives[alert.server][alert.zone].cutoff = 100 - alert.vs - alert.nc - alert.tr;
        }
    };

    factory.addActive = function (messageData) {
        console.log("Adding new alert");
        console.log('Raw alert', messageData);
        var alert = factory.parseAlertDataInitial(messageData);

        if (typeof factory.actives[alert.server] === 'undefined') {
            factory.actives[alert.server] = {};
        }

        factory.actives[alert.server][alert.zone] = alert;

        // @todo Look into seeing if we can do this via an event upon element render. Timer will do for now.
        setTimeout(function() {
            setMonitorCountdown(alert.alertID);
        }, 1000);

        console.log("Started alert", factory.actives[alert.server][alert.zone]);
    };

    factory.endActive = function (message) {
        var alert = message.data;
        delete factory.actives[alert.server][alert.zone];

        AlertStatisticsService.increaseAlertTotal();
        console.log("Ended alert", alert.server, alert.zone);
    };

    factory.parseAlertDataInitial = function (alert) {
        var time = new Date().getTime();
        var remainingJS = (parseInt(alert.remaining) * 1000);
        var realEnd = (time + remainingJS);

        var obj = {
            alertID:   parseInt(alert.resultID),
            started:   parseInt(alert.startTime),
            ends:      parseInt(alert.endTime),
            countdown: realEnd,
            vs:        parseInt(alert.controlVS),
            nc:        parseInt(alert.controlNC),
            tr:        parseInt(alert.controlTR),
            server:    parseInt(alert.world),
            zone:      parseInt(alert.zone)
        };

        console.log('parsed alert', obj);
        console.log('alert.endtime', alert.endTime);
        console.log('alert.remaining', alert.remaining);
        console.log('countdown', obj.countdown);

        return obj;
    };

    factory.parseAlertDataUpdate = function (alert) {
        return {
            alertID: parseInt(alert.resultID),
            vs:      parseInt(alert.controlVS),
            nc:      parseInt(alert.controlNC),
            tr:      parseInt(alert.controlTR),
            server:  parseInt(alert.world),
            zone:    parseInt(alert.zone),
            defence: parseInt(alert.defence)
        };
    };

    return factory;
});
