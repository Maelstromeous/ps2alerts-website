app.service('HomeZoneVictoryService', function ($http, $rootScope, ConfigDataService) {
    var factory = {
        zones: {},
        zoneTotals: {},
        serverEmpireStats: {}
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
                factory.handleZoneData(8, result[3]),
                factory.calculateServerEmpireStats(result)
            ]).then(function(result) {
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
                });
                factory.zones[zone][server].total = values.data.total;

            });

            return resolve();
        });
    };

    factory.calculateServerEmpireStats = function(data) {
        return new Promise(function(resolve, reject) {
            

            return resolve();
        });
    }

    return factory;
});
