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
        method : 'POST',
        url    : ConfigDataService.apiUrl + '/statistics/alert/total',
    }).then(function(data) {
        factory.total = data.data[0].COUNT;
    });

    $http({
        method : 'POST',
        url    : ConfigDataService.apiUrl + '/statistics/alert/total',
        data   : {"wheres":{"ResultDomination": 1}}
    }).then(function(data) {
        factory.dominations = data.data[0].COUNT;
    });

    angular.forEach(ConfigDataService.factions, function(faction) {
        $http({
            method : 'POST',
            url    : ConfigDataService.apiUrl + '/statistics/alert/total',
            data   : {"wheres":{"ResultWinner":faction}}
        }).then(function(data) {
            factory.factionWins[faction] = data.data[0].COUNT;
        });

        if (faction !== 'draw') {
            $http({
                method : 'POST',
                url    : ConfigDataService.apiUrl + '/statistics/alert/total',
                data   : {"wheres":{"ResultWinner": faction,"ResultDomination": 1}}
            }).then(function(data) {
                factory.factionDoms[faction] = data.data[0].COUNT;
            });
        }
    });

    return factory;
});
