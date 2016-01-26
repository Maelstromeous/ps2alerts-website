app.service('ZoneStatisticsService', function ($http, $log, ConfigDataService) {
    var factory = {
        zones: {},
        zoneTotals: {}
    };

    // Instantiate the object properties
    angular.forEach(ConfigDataService.zones, function (zone) {
        factory.zones[zone]      = {};
        factory.zoneTotals[zone] = 0;
        angular.forEach(ConfigDataService.servers, function (server) {
            factory.zones[zone][server] = {
                total: 0
            };
            angular.forEach(ConfigDataService.factions, function (faction) {
                factory.zones[zone][server][faction] = 0;
            });
        });
    });

    $http({
        method : 'GET',
        url    : ConfigDataService.apiUrl + '/alerts/counts/victories?zones=2',
    }).then(function(data) {
        var returned = data.data.data; // #Dataception

        $log.log(returned);
        angular.forEach(returned, function (values, server) {
            angular.forEach(ConfigDataService.factions, function (faction) {
                factory.zones[2][server][faction] = values.data[faction];
            });

            factory.zones[2][server].total = values.data.total;
        });
    });

    $http({
        method : 'GET',
        url    : ConfigDataService.apiUrl + '/alerts/counts/victories?zones=4',
    }).then(function(data) {
        var returned = data.data.data; // #Dataception

        $log.log(returned);
        angular.forEach(returned, function (values, server) {
            angular.forEach(ConfigDataService.factions, function (faction) {
                factory.zones[4][server][faction] = values.data[faction];
            });

            factory.zones[4][server].total = values.data.total;
        });
    });

    $http({
        method : 'GET',
        url    : ConfigDataService.apiUrl + '/alerts/counts/victories?zones=6',
    }).then(function(data) {
        var returned = data.data.data; // #Dataception

        $log.log(returned);
        angular.forEach(returned, function (values, server) {
            angular.forEach(ConfigDataService.factions, function (faction) {
                factory.zones[6][server][faction] = values.data[faction];
            });

            factory.zones[6][server].total = values.data.total;
        });
    });

    $http({
        method : 'GET',
        url    : ConfigDataService.apiUrl + '/alerts/counts/victories?zones=8',
    }).then(function(data) {
        var returned = data.data.data; // #Dataception

        $log.log(returned);
        angular.forEach(returned, function (values, server) {
            angular.forEach(ConfigDataService.factions, function (faction) {
                factory.zones[8][server][faction] = values.data[faction];
            });

            factory.zones[8][server].total = values.data.total;
        });
    });

    $log.log(factory.zones);

    return factory;
});
