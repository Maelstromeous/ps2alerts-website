app.service('AlertHistoryService', function ($http, $log, $filter, ConfigDataService) {
    var factory = {
        empty: false,
        inProgress: false
    };

    factory.resetData = function() {
        factory.history = {};
        factory.metrics = {
            caps: 0,
            defs: 0,
            wins : {
                vs: 0,
                nc: 0,
                tr: 0,
                draw: 0
            },
            brackets: {
                mor: 0,
                aft: 0,
                pri: 0
            },
            zones: {
                2: 0,
                4: 0,
                6: 0,
                8: 0
            }
        };
    };

    factory.applyFilter = function(filters) {
        if (factory.inProgress === false) {
            factory.resetData();
            factory.inProgress = true;
            var url = ConfigDataService.apiUrl + '/alerts/history?embed=maps';

            // Servers = [1,10,13,17,25,1000,2000];
            if (filters.servers && filters.servers.length > 0) {
                url += '&servers=' + filters.servers.toString();
            }
            // Zones = [2,4,6,8];
            if (filters.zones && filters.zones.length > 0) {
                url += '&zones=' + filters.zones.toString();
            }

            // Factions = ['vs','nc','tr','draw'];
            if (filters.factions && filters.factions.length > 0) {
                url += '&factions=' + filters.factions.toString();
            }

            // Brackets = ['MOR','AFT','PRI'];
            if (filters.brackets && filters.brackets.length > 0) {
                url += '&brackets=' + filters.brackets.toString();
            }

            factory.empty = false;

            // Get the data
            $http({
                method : 'GET',
                url    : url,
            }).then(function(data) {
                var returned = data.data.data; // #Dataception
                factory.inProgress = false;

                if (returned.length === 0) {
                    // Stop here and return
                    factory.empty = true;
                    return false;
                }

                // Generate metrics and transform timestamps
                angular.forEach(returned, function(alert) {
                    alert = factory.parseAlert(alert); // Parse the alert and return
                });

                factory.history = returned;
            });
        }
    };

    // Parses alerts to add to the list
    factory.parseAlert = function(alert) {
        var last = alert.maps.data.length - 1;

        alert.lastMap = alert.maps.data[last];

        alert.lastMap.controlTotal =
            alert.lastMap.controlVS +
            alert.lastMap.controlNC +
            alert.lastMap.controlTR;

        alert.started     = alert.started * 1000;
        alert.ended       = alert.ended * 1000;
        // Do a series of filtering to remove a crapton of watchers from the view
        alert.endedDate   = $filter('date')(alert.ended, 'dd-MMM-yyyy HH:mm:ss');
        alert.timeBracket = ConfigDataService.timeBrackets[alert.timeBracket].label;
        alert.server      = ConfigDataService.serverNames[alert.server];
        alert.zone        = ConfigDataService.zoneNames[alert.zone];

        // Update factory metrics
        factory.metrics.wins[alert.winner.toLowerCase()]++;
        factory.metrics.brackets[alert.timeBracket.toLowerCase()]++;
        factory.metrics.zones[alert.zone]++;

        if (alert.maps.data) {
            angular.forEach(alert.maps.data, function(map) {
                if (map.isDefence === false) {
                    factory.metrics.caps++;
                } else {
                    factory.metrics.defs++;
                }
            });
        }

        return alert;
    };

    // Called by WebsocketService when an alert is declared as ended
    factory.appendAlert = function(alert) {
        // Get the info we need from the API then add to the list
        $http({
            method : 'GET',
            url    : ConfigDataService.apiUrl + '/alerts/' + alert.id +'?embed=maps',
        }).then(function(data) {
            factory.history.unshift(factory.parseAlert(data.data.data));
        });
    };

    return factory;
});
