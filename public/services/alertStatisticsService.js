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

    // Populate faction wins
    for (var i = 0; i < ConfigDataService.factions.length; i++) {
        var faction = ConfigDataService.factions[i].toUpperCase();

        $http({
            method: 'POST',
            url   : ConfigDataService.apiUrl + '/statistics/alert/total',
            data  :
            { "wheres":
                { "ResultWinner": faction }
            }
        }).then(function(data) {
            factory.factionWins[faction] = data.data[0]["COUNT"];
        });
    }

    for (var d = 0; d < ConfigDataService.factions.length; d++) {
        if (d < 3) { // Don't want 4th draw loop as there is no such thing
            var faction = ConfigDataService.factions[d].toUpperCase();
            $log.log(faction);
            $http({
                method: 'POST',
                url   : ConfigDataService.apiUrl + '/statistics/alert/total',
                data  :
                { "wheres":
                    {
                        "ResultDomination": 1,
                        "ResultWinner": faction
                    }
                }
            }).then(function(data) {
                $log.log(data);
                factory.factionDoms[faction] = data.data[0]["COUNT"];
            });
        }
    }

    return factory;
});
