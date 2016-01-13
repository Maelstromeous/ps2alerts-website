app.service('ServerStatisticsService', function ($http, $log, ConfigDataService) {
    var factory = {
        victories: {}
    };

    angular.forEach(ConfigDataService.servers, function(server) {
        factory.victories[server] = {};
        angular.forEach(ConfigDataService.factions, function(faction) {
            factory.victories[server][faction] = 0;
        });
    });

    $log.log(factory);
    return factory;
});
