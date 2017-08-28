app.service('HomeVictoryStatisticsService', function(
    $http,
    $filter,
    ConfigDataService
) {
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
        },
        inProgress: false
    };

    factory.increaseAlertTotal = function() {
        factory.totals.alerts.total++;
    };

    factory.increaseDominationTotal = function() {
        factory.totals.dominations.total++;
    };

    factory.increaseVictories = function(server, faction) {
        if (factory.victories && factory.totals) {
            factory.victories[server][faction]++;
            factory.totals.alerts[faction]++;
        }
    };

    factory.increaseDominations = function(server, faction) {
        factory.dominations[server][faction]++;
        factory.totals.dominations[faction]++;
    };

    factory.resetData = function() {
        // Instantiate the object properties

        factory.totals.alerts.total = 0;
        factory.totals.dominations.total = 0;

        angular.forEach(ConfigDataService.servers, function(server) {
            angular.forEach(ConfigDataService.factions, function(faction) {
                factory.victories[server]   = {};
                factory.dominations[server] = {};

                factory.victories[server][faction]   = 0;
                factory.dominations[server][faction] = 0;

                factory.totals.alerts[faction]      = 0;
                factory.totals.dominations[faction] = 0;
            });
        });
    };

    factory.applyFilter = function(filters) {
        console.log('bewbs');
        console.log('filters', filters);

        if (factory.inProgress === true) {
            return;
        }
        factory.resetData();
        factory.inProgress = true;

        // Date From / To
        var params = '?dateFrom=' + $filter('date')(filters.dateFrom, 'yyyy-MM-dd');
        params += '&dateTo=' + $filter('date')(filters.dateTo, 'yyyy-MM-dd');

        // Servers = [1,10,13,17,25,1000,2000];
        if (filters.servers && filters.servers.length > 0) {
            params += '&servers=' + filters.servers.toString();
        }

        // Zones = [2,4,6,8];
        if (filters.zones && filters.zones.length > 0) {
            params += '&zones=' + filters.zones.toString();
        }

        // Brackets = ['MOR','AFT','PRI'];
        if (filters.brackets && filters.brackets.length > 0) {
            params += '&brackets=' + filters.brackets.toString();
        }

        // Get the data
        $http({
            method: 'GET',
            url: ConfigDataService.apiUrl + '/alerts/counts/victories' + params
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
            method: 'GET',
            url: ConfigDataService.apiUrl + '/alerts/counts/dominations' + params
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
    };

    return factory;
});
