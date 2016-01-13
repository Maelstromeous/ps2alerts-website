app.service('ConfigDataService', function(ENV) {
    var factory = {};

    factory.baseUrl = ENV.baseUrl;
    factory.apiUrl = ENV.apiUrl;

    factory.factions = ['vs','nc','tr','draw'];
    factory.servers = [1,10,13,17,25,1000,2000];
    factory.serverNames = {
        1:    'Connery',
        10:   'Miller',
        13:   'Cobalt',
        17:   'Emerald',
        25:   'Briggs',
        1000: 'Genudine',
        2000: 'Ceres'
    };

    return factory;
});
