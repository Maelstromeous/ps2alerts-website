app.service('ConfigDataService', function(ENV) {
    var factory = {};

    factory.baseUrl = ENV.baseUrl;
    factory.apiUrl = ENV.apiUrl;

    factory.factions = ['vs','nc','tr','draw'];
    factory.factionsAlpha = {
        'vs': 'Vanu Sovereignty',
        'nc': 'New Conglomerate',
        'tr': 'Terran Republic',
        'draw': 'Draw'
    };
    factory.factionsNumeric = [1,2,3,-1];
    factory.servers = [1,10,13,17,25,1000,2000];
    factory.serversAlpha = [25,13,1,17,10,1000,2000];
    factory.serverNames = {
        1:    'Connery',
        10:   'Miller',
        13:   'Cobalt',
        17:   'Emerald',
        25:   'Briggs',
        1000: 'Genudine',
        1001: 'Lithcorp',
        2000: 'Ceres',
        2001: 'Palos'
    };
    factory.zones = [2,4,6,8];
    factory.zonesAlpha = [6,8,4,2];
    factory.zoneNames = {
        2: 'Indar',
        4: 'Hossin',
        6: 'Amerish',
        8: 'Esamir'
    };
    factory.timeBrackets = {
        'MOR': 'Morning (00:00 - 11:59)',
        'AFT': 'Afternoon (12:00 - 16:59)',
        'PRI': 'Prime TIme (17:00 - 23:59)'
    };

    factory.convertFactionNameToInt = function(name) {
        switch(name) {
            case "VS":
                return 1;
            case "NC":
                return 2;
            case "TR":
                return 3;
        }
    };

    return factory;
});
