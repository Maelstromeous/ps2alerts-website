app.service('PlayerProfileService', function ($http, $log, ConfigDataService) {
    var factory = {
        data: {}
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

    factory.getProfileData = function(id) {
        return new Promise(function(resolve, reject) {
            $http({
                method : 'GET',
                url    : ConfigDataService.apiUrl + '/profiles/player/' + id
            }).then(function(returned) {
                return resolve(returned.data.data);
            });
        });
    };

    return factory;
});
