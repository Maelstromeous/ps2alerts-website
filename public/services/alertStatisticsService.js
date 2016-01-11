app.service('AlertStatisticsService', function ($http, $log, ConfigDataService) {
    var factory = {
        total: 0,
        dominations: 0,
        factionWins: {
            vs: 0,
            nc: 0,
            tr: 0,
            draw: 0
        },
        factionDoms: {
            vs: 0,
            nc: 0,
            tr: 0
        }
    };

    // Get the metrics
    $http({
        method : 'POST',
        url    : ConfigDataService.apiUrl + '/statistics/alert/total'
    }).then(function(data) {
        factory.total = data.data[0]["COUNT"];
    });

    $http({
        method: 'POST',
        url   : ConfigDataService.apiUrl + '/statistics/alert/total',
        data  : { "wheres": { "ResultDomination": "1" } }
    }).then(function(data) {
        factory.dominations = data.data[0]["COUNT"];
    });

    $log.log(ConfigDataService.factions[0]);

    // Populate faction wins
    for (var i = 0; i < ConfigDataService.factions.length; i++) {
        $http({
            method: 'POST',
            url   : ConfigDataService.apiUrl + '/statistics/alert/total',
            data  :
            { "wheres":
                { "ResultWinner": ConfigDataService.factions[i].toUpperCase() }
            }
        }).then(function(data) {
            factory.factionWins[faction] = data.data[0]["COUNT"];
        });
    }

    for (var d = 0; i < ConfigDataService.factions.length; d++) {
        if (d < 3) { // Don't want 4th draw loop as there is no such thing
            $http({
                method: 'POST',
                url   : ConfigDataService.apiUrl + '/statistics/alert/total',
                data  :
                { "wheres":
                    {
                        "ResultDomination": 1,
                        "ResultWinner": ConfigDataService.factions[i].toUpperCase()
                    }
                }
            }).then(function(data) {
                factory.factionDoms[faction] = data.data[0]["COUNT"];
            });
        }
    }

    return factory;
});
