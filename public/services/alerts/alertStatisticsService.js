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
        url    : ConfigDataService.apiUrl + '/statistics/alert/total',
        headers: {'Content-type': 'application/json'}
    }).then(function(data) {
        factory.total = data.data[0].COUNT;
    });

    $http({
        method: 'POST',
        url   : ConfigDataService.apiUrl + '/statistics/alert/total',
        data  : { "wheres": { "ResultDomination": "1" } },
        headers: {'Content-type': 'application/json'}
    }).then(function(data) {
        factory.dominations = data.data[0].COUNT;
    });

    $http({
        method: 'POST',
        url   : ConfigDataService.apiUrl + '/statistics/alert/total',
        data  : { "wheres": { "ResultWinner": "vs" } },
        headers: {'Content-type': 'application/json'}
    }).then(function(data) {
        factory.factionWins.vs = data.data[0].COUNT;
    });

    $http({
        method: 'POST',
        url   : ConfigDataService.apiUrl + '/statistics/alert/total',
        data  : { "wheres": { "ResultWinner": "nc" } },
        headers: {'Content-type': 'application/json'}
    }).then(function(data) {
        factory.factionWins.nc = data.data[0].COUNT;
    });

    $http({
        method: 'POST',
        url   : ConfigDataService.apiUrl + '/statistics/alert/total',
        data  : { "wheres": { "ResultWinner": "tr" } },
        headers: {'Content-type': 'application/json'}
    }).then(function(data) {
        factory.factionWins.tr = data.data[0].COUNT;
    });

    $http({
        method: 'POST',
        url   : ConfigDataService.apiUrl + '/statistics/alert/total',
        data  : { "wheres": { "ResultWinner": "draw" } }
    }).then(function(data) {
        factory.factionWins.draw = data.data[0].COUNT;
    });

    $http({
        method: 'POST',
        url   : ConfigDataService.apiUrl + '/statistics/alert/total',
        data  :
        { "wheres":
            {
                "ResultDomination": 1,
                "ResultWinner": "vs"
            }
        },
        headers: {'Content-type': 'application/json'}
    }).then(function(data) {
        factory.factionDoms.vs = data.data[0].COUNT;
    });

    $http({
        method: 'POST',
        url   : ConfigDataService.apiUrl + '/statistics/alert/total',
        data  :
        { "wheres":
            {
                "ResultDomination": 1,
                "ResultWinner": "nc"
            }
        },
        headers: {'Content-type': 'application/json'}
    }).then(function(data) {
        factory.factionDoms.nc = data.data[0].COUNT;
    });

    $http({
        method: 'POST',
        url   : ConfigDataService.apiUrl + '/statistics/alert/total',
        data  :
        { "wheres":
            {
                "ResultDomination": 1,
                "ResultWinner": "tr"
            }
        },
        headers: {'Content-type': 'application/json'}
    }).then(function(data) {
        factory.factionDoms.tr = data.data[0].COUNT;
    });

    return factory;
});
