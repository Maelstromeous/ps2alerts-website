app.service('HomeCombatStatisticsService', function($http, $log, ConfigDataService) {
    var factory = {
        metrics: {}
    };

    // Instantiate the object properties
    factory.init = function() {
        var metrics = ['kills', 'deaths', 'teamkills', 'suicides', 'headshots'];

        var servers = ConfigDataService.servers;
        servers.push('all');

        angular.forEach(servers, function(server) {
            factory.metrics[server] = {};
            factory.metrics[server].totals = {
                kills: 0,
                deaths: 0,
                teamkills: 0,
                suicides: 0,
                headshots: 0
            };
            angular.forEach(metrics, function(metric) {
                factory.metrics[server][metric] = {};

                angular.forEach(ConfigDataService.factions, function(faction) {
                    if (faction !== 'draw') {
                        factory.metrics[server][metric][faction] = 0;
                    }
                });
            });
        });

        // Get the data
        $http({
            method: 'GET',
            url: ConfigDataService.apiUrl + '/alerts/combat/totals',
        }).then(function(data) {
            factory.metrics = data.data;

            console.log('new Factory', factory.metrics);
        });
    };

    return factory;
});
