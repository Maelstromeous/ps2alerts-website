app.service('AlertHistoryService', function ($http, $log, ConfigDataService) {
    var factory = {
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
        factory.resetData();
        console.log(filters);

        var url = ConfigDataService.apiUrl + '/alerts/history?embed=maps';

        // Servers = [1,10,13,17,25,1000,2000];
        if (filters.servers && filters.servers.length > 0) {
            url += '&servers=' + filters.servers.toString();
        }
        // Zones = [2,4,6,8];
        if (filters.zones && filters.zones.length > 0) {
            url += '&zones=' + filters.zones.toString();
        }

        // factions = ['vs','nc','tr','draw'];
        if (filters.factions && filters.factions.length > 0) {
            url += '&factions=' + filters.factions.toString();
        }

        // brackets = ['MOR','AFT','PRI'];
        if (filters.brackets && filters.brackets.length > 0) {
            url += '&brackets=' + filters.brackets.toString();
        }

        console.log(url);

        // Get the data
        $http({
            method : 'GET',
            url    : url,
        }).then(function(data) {
            var returned = data.data.data; // #Dataception

            // Generate metrics and transform timestamps
            angular.forEach(returned, function(alert) {
                var last = alert.maps.data.length - 1;

                angular.forEach(alert.maps.data, function(map) {
                    if (map.isDefence === false) {
                        factory.metrics.caps++;
                    } else {
                        factory.metrics.defs++;
                    }
                });

                factory.metrics.wins[alert.winner.toLowerCase()]++;
                factory.metrics.brackets[alert.timeBracket.toLowerCase()]++;
                factory.metrics.zones[alert.zone]++;

                alert.started = alert.started * 1000;
                alert.ended   = alert.ended * 1000;
                alert.lastMap = alert.maps.data[last];
            });

            factory.history = returned;

            $log.log(factory);
        });
    };

    return factory;
});
