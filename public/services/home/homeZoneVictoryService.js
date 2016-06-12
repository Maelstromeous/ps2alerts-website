app.service('HomeZoneVictoryService', function ($http, $rootScope, ConfigDataService) {
    var factory = {
        zones: {},
        zoneTotals: {},
        serverEmpireStats: {},
        serverEmpireTotals: {
            all: 0
        }
    };

    factory.init = function() {
        // Instantiate the object properties
        _.forEach(ConfigDataService.zones, function (zone) {
            factory.zones[zone]      = {};
            factory.zoneTotals[zone] = {};
            _.forEach(ConfigDataService.servers, function (server) {
                factory.zones[zone][server] = {
                    total: 0
                };
                _.forEach(ConfigDataService.factions, function (faction) {
                    factory.zones[zone][server][faction] = 0;
                    factory.zoneTotals[zone][faction] = 0;
                });
            });
        });

        _.forEach(ConfigDataService.factions, function (faction) {
            factory.serverEmpireStats[faction] = {};
            _.forEach(ConfigDataService.servers, function (server) {
                factory.serverEmpireStats[faction][server] = 0;
            });
        });

        Promise.all([
            factory.getZoneData(2),
            factory.getZoneData(4),
            factory.getZoneData(6),
            factory.getZoneData(8)
        ]).then(function(result) {
            Promise.all([
                factory.handleZoneData(2, result[0]),
                factory.handleZoneData(4, result[1]),
                factory.handleZoneData(6, result[2]),
                factory.handleZoneData(8, result[3])
            ]).then(function(result) {
                // Generate Server Contribution Totals
                _.forEach(factory.serverEmpireStats, function (servers, faction) {
                    var count = 0;
                    _.forEach(servers, function(value, server) {
                        count += value;
                    });
                    factory.serverEmpireTotals[faction] = count;
                    factory.serverEmpireTotals.all += count;
                });

                // Sort the object by number of wins
                var sortable = {};
                _.forEach(factory.serverEmpireStats, function (servers, faction) {
                    sortable[faction] = [];
                    _.forEach(servers, function (value, key) {
                        sortable[faction].push([key, value]);
                    });
                });

                _.forEach(sortable, function (value, faction) {
                    sortable[faction].sort(function(a, b) {
                        if (a[1] > b[1]) {
                            return -1;
                        }

                        if (a[1] == b[1]) {
                            return 0;
                        }

                        return 1;
                    })
                });

                // Now we're sorted, rebuild the object
                factory.serverEmpireStats = {};
                _.forEach(sortable, function (servers, faction) {
                    factory.serverEmpireStats[faction] = {};

                    _.forEach(servers, function (values, key) {
                        factory.serverEmpireStats[faction][key] = {
                            'server': values[0],
                            'value': values[1]
                        };
                    });
                });

                $rootScope.$broadcast('zonesLoaded', 'loaded');
            });
        });
    }

    factory.getZoneData = function(zone) {
        return new Promise(function(resolve, reject) {
            $http({
                method : 'GET',
                url    : ConfigDataService.apiUrl + '/alerts/counts/victories?zones=' + zone,
            }).then(function(data) {
                return resolve(data.data.data); //#Dataception
            });
        });
    };

    factory.handleZoneData = function(zone, data) {
        return new Promise(function(resolve, reject) {
            angular.forEach(data, function(values, server) {
                angular.forEach(ConfigDataService.factions, function(faction) {
                    factory.zones[zone][server][faction] = values.data[faction];
                    factory.zoneTotals[zone][faction] += values.data[faction];
                    factory.serverEmpireStats[faction][server] += values.data[faction];
                });
                factory.zones[zone][server].total = values.data.total;
            });

            return resolve();
        });
    };

    return factory;
});
