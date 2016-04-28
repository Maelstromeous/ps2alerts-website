app.service('OutfitProfileService', function(
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
        factory.data = {};
        factory.metrics = {};
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
                url    : ConfigDataService.apiUrl + '/profiles/outfit/' + id + '?embed=facilities,metrics,involvement,players'
            }).then(function(returned) {
                return resolve(returned.data.data);
            });
        });
    };

    factory.startProcessing = function(data) {
        factory.data = data;

        factory.data.serverName = ConfigDataService.serverNames[factory.data.server];
        factory.data.factionAbv = ConfigDataService.convertFactionIntToName(factory.data.faction);

        factory.metrics.kd = factory.returnKD(data.metrics.data);
        factory.metrics.killsPerAlert = (data.metrics.data.kills / data.metrics.data.involved).toFixed(2);
        factory.metrics.deathsPerAlert = (data.metrics.data.deaths / data.metrics.data.involved).toFixed(2);

        factory.processCaptures();

        console.log(factory);

        $rootScope.$broadcast('dataLoaded', 'loaded');
    };

    factory.processCaptures = function() {
        _.forEach(factory.data.facilities.data, function(value, key) {
            if (value.id !== 0) {
                var ref = _.findIndex(
                    factory.configData.facilities.data, { 'id' : value.id }
                );

                if (ref >= 0) {
                    value.name = factory.configData.facilities.data[ref].name;
                    value.type = factory.configData.facilities.data[ref].type;
                } else {
                    value.name = 'UNKNOWN!';
                    value.type = null;
                }
            } else {
                value.name = "UNKNOWN!!";
                value.type = null;
            }
        });
    };

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
