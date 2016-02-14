app.service('AlertHistoryService', function ($http, $log, ConfigDataService) {
    var factory = {
        history: {}
    };

    // Get the data
    $http({
        method : 'GET',
        url    : ConfigDataService.apiUrl + '/alerts/history?embed=maps,combats',
    }).then(function(data) {
        var returned = data.data.data; // #Dataception

        // Generate metrics and transform timestamps
        angular.forEach(returned, function(alert) {
            var last = alert.maps.data.length - 1;
            alert.caps = 0;

            angular.forEach(alert.maps.data, function(map) {
                if (map.isDefence === false) {
                    alert.caps++;
                }
            })

            alert.started = alert.started * 1000;
            alert.ended   = alert.ended * 1000;
            alert.lastMap = alert.maps.data[last];
        });

        factory.history = returned;

        $log.log(factory.history);
    });

    return factory;
});
