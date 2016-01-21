app.service('WebsocketService', function($log) {
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
                        factory.addActive(message);
                        break;
                    }
                    case 'alertEnd': {
                        factory.removeActive(message);
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
                console.log(alert);
                factory.actives[alert.world] = {};
                factory.actives[alert.world][alert.zone] = {
                    started: parseInt(alert.startTime),
                    ends: parseInt(alert.endTime),
                    countdown: parseInt(alert.remaining+'000'),
                    vs: parseInt(alert.controlVS),
                    nc: parseInt(alert.controlNC),
                    tr: parseInt(alert.controlTR),
                    server: parseInt(alert.world),
                    zone: parseInt(alert.zone),
                };
                var obj = factory.actives[alert.world][alert.zone];
                factory.actives[obj.server][obj.zone].cutoff = 100 - obj.vs - obj.nc - obj.tr;
            });
        });

        $log.log(factory.actives);
    };

    factory.updateActives = function (message) {
        if (message.data.defence === 0) {
            var alert = message.data;
            factory.actives[alert.world][alert.zone].vs = parseInt(alert.controlVS);
            factory.actives[alert.world][alert.zone].nc = parseInt(alert.controlNC);
            factory.actives[alert.world][alert.zone].tr = parseInt(alert.controlTR);
            factory.actives[alert.world][alert.zone].cutoff = 100 - alert.vs - alert.nc - alert.tr;

            console.log("Updated Actives");
            $log.log(factory.actives[alert.world][alert.zone]);
        }
    };

    factory.addActive = function (message) {
        var alert = message.data;
        if (typeof factory.actives[alert.server] === 'undefined') {
            factory.actives[alert.server] = {};
        }
    };

    factory.removeActive = function (message) {
        var alert = message.data;
        delete factory.actives[alert.server][alert.zone];
        console.log("Removed alert", alert.server, alert.zone);
    };

    factory.timers = function () {
        angular.forEach(factory.actives, function (servers) {
            angular.forEach(servers, function (alert) {
                var server = alert.server;
                var zone = alert.zone;
                factory.actives[server][zone].countdown--;
            });
        });
    };

    return factory;
});
