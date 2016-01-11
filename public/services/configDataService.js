app.service('ConfigDataService', function(ENV) {
    var factory = {};

    factory.baseUrl = ENV.baseUrl;
    factory.apiUrl = ENV.apiUrl;

    factory.factions = ['vs','nc','tr','draw'];

    return factory;
});
