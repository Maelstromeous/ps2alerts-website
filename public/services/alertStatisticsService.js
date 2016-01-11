app.service('AlertStatisticsService', function ($http, ENV) {
    var factory = {
        total: 0,
        dominations: 0
    };
    
    // Get the metrics
    $http({
        method : 'POST',
        url    : ENV.apiUrl + '/statistics/alert/total'
    }).then(function(data) {
        factory.total = data.data[0]["COUNT"];
    });

    $http({
        method: 'POST',
        url   : ENV.apiUrl + '/statistics/alert/total',
        data  : { "wheres": { "ResultDomination": "1" } }
    }).then(function(data) {
        factory.dominations = data.data[0]["COUNT"];
    });


    return factory;
});
