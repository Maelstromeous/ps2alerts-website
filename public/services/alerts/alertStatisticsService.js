app.service('AlertStatisticsService', function ($http, $log, ConfigDataService) {
    var factory = {
        total: 0,
        dominations: 0,
        factionWins: {},
        factionDoms: {}
    };

    angular.forEach(ConfigDataService.factions, function(faction) {
        factory.factionWins[faction] = 0;
        if (faction !== 'draw') {
            factory.factionDoms[faction] = 0;
        }
    });

    // Get teh dataz
    $http({
        method : 'GET',
        url    : ConfigDataService.apiUrl + '/alerts/counts/victories',
    }).then(function(data) {
        var returned             = data.data.data; // #Dataception
        factory.total            = returned.total;
        factory.factionWins.vs   = returned.vs;
        factory.factionWins.nc   = returned.nc;
        factory.factionWins.tr   = returned.tr;
        factory.factionWins.draw = returned.draw;

        $log.log(factory.factionWins);
    });

    $http({
        method : 'GET',
        url    : ConfigDataService.apiUrl + '/alerts/counts/dominations',
    }).then(function(data) {
        var returned             = data.data.data; // #Dataception
        factory.dominations      = returned.total;
        factory.factionDoms.vs   = returned.vs;
        factory.factionDoms.nc   = returned.nc;
        factory.factionDoms.tr   = returned.tr;

        $log.log(factory.factionDoms);
    });

    return factory;
});
