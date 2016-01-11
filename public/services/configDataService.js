app.service('ConfigDataService', function() {
    var factory = {};

    factory.baseUrl = config.baseUrl;
    factory.apiUrl = config.apiUrl;

    return factory;
});
