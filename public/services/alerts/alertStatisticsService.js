app.service('AlertStatisticsService', function ($http, $log, ConfigDataService) {
    var factory = {
        victories: {},
        dominations: {},
        totals: {
            alerts: {
                total: 0
            },
            dominations: {
                total: 0
            }
        }
    };

    // Instantiate the object properties
    angular.forEach(ConfigDataService.servers, function (server) {
        angular.forEach(ConfigDataService.factions, function(faction) {
            factory.victories[server]   = {};
            factory.dominations[server] = {};

            factory.victories[server][faction]   = 0;
            factory.dominations[server][faction] = 0;

            factory.totals.alerts[faction] = 0;
            factory.totals.dominations[faction] = 0;
        });
    });

    // Get the data
    $http({
        method : 'GET',
        url    : ConfigDataService.apiUrl + '/alerts/counts/victories',
    }).then(function(data) {
        var returned = data.data.data; // #Dataception
        angular.forEach(returned, function(values, server) {
            angular.forEach(ConfigDataService.factions, function(faction) {
                factory.victories[server][faction] = values.data[faction];
                factory.totals.alerts[faction]    += values.data[faction];
            });

            factory.totals.alerts.total += values.data.total;
        });
    });

    $http({
        method : 'GET',
        url    : ConfigDataService.apiUrl + '/alerts/counts/dominations',
    }).then(function(data) {
        var returned = data.data.data; // #Dataception

        angular.forEach(returned, function(values, server) {
            angular.forEach(ConfigDataService.factions, function(faction) {
                factory.dominations[server][faction] = values.data[faction];
                factory.totals.dominations[faction] += values.data[faction];
            });

            factory.totals.dominations.total += values.data.total;
        });
    });

    return factory;
});
