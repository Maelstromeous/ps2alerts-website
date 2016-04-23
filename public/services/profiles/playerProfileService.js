app.service('PlayerProfileService', function(
    $http,
    $log,
    $rootScope,
    ConfigDataService
) {
    var factory = {
        data: {},
        metrics: {}
    };

    // Called from the controller to initialise getting a player's profile
    factory.getProfile = function(id) {
        Promise.all([
            factory.getConfigData,
            factory.getProfileData(id)
        ]).then(function(result) {
            console.log('Promise completed', result);
            factory.configData = result[0];
            // FIRE
            factory.startProcessing(result[1]);
        });
    };

    factory.getConfigData = new Promise(function(resolve, reject) {
        $http({
            method : 'GET',
            url    : ConfigDataService.apiUrl + '/data?embed=facilities,vehicles,weapons,xps'
        }).then(function(returned) {
            return resolve(returned.data.data);
        });
    });

    factory.getProfileData = function(id) {
        return new Promise(function(resolve, reject) {
            $http({
                method : 'GET',
                url    : ConfigDataService.apiUrl + '/profiles/player/' + id + '?embed=census,metrics,outfit,involvement'
            }).then(function(returned) {
                return resolve(returned.data.data);
            });
        });
    };

    factory.startProcessing = function(data) {
        console.log('Got data:', data);

        factory.data = data;

        factory.metrics.kd = factory.returnKD(data.metrics.data);
        factory.metrics.killsPerAlert = (data.metrics.data.kills / data.metrics.data.involved).toFixed(2);
        factory.metrics.deathsPerAlert = (data.metrics.data.deaths / data.metrics.data.involved).toFixed(2);

        console.log(factory);

        $rootScope.$broadcast('dataLoaded', 'loaded');
    }

    // Calculate KD
    factory.returnKD = function(data) {
        var kd =
        parseFloat((data.kills / data.deaths).toFixed(2));

        if (kd == 'Infinity' || isNaN(kd)) {
            kd = data.kills;
        }

        return kd;
    };

    return factory;
});
