app.service('ConfigDataService', function(ENV, $rootScope, $location, $document) {
    var factory = {
        environment: ENV.environment,
        baseUrl: ENV.baseUrl,
        apiUrl: ENV.apiUrl,
        websocketUrl: ENV.websocketUrl,
        factions: ['vs','nc','tr','draw'],
        factionsAlpha: {
            'vs': 'Vanu Sovereignty',
            'nc': 'New Conglomerate',
            'tr': 'Terran Republic',
            'draw': 'Draw'
        },
        factionsNumeric: [1,2,3,-1],
        servers: [1, 10, 13, 17, 25, 1000, 2000],
        serversAlpha: [25, 13, 1, 2000, 17, 10, 1000],
        serverNames: {
            1:    'Connery',
            10:   'Miller',
            13:   'Cobalt',
            17:   'Emerald',
            19:   'Jaeger',
            25:   'Briggs',
            1000: 'Genudine',
            1001: 'Lithcorp',
            2000: 'Ceres',
            2001: 'Palos'
        },
        zones: [2,4,6,8],
        zoneNames: {
            2: 'Indar',
            4: 'Hossin',
            6: 'Amerish',
            8: 'Esamir'
        },
        zonesAlpha: [6,8,4,2],
        timeBrackets: {
            'MOR': {
                label: 'Morning',
                desc: '(00:00 - 11:59)'
            },
            'AFT': {
                label: 'Afternoon',
                desc: '(12:00 - 16:59)'
            },
            'PRI': {
                label: 'Prime Time',
                desc: '(17:00 - 23:59)'
            }
        },
        facilityTypes: {
            2: 'Amp Station',
            3: 'Bio Lab',
            4: 'Tech Plant',
            5: 'Large Outpost',
            6: 'Small Outpost',
            7: 'Warpgate',
            8: 'Interlink' // #BRING BACK THE INTERLINK
        },
        facilityTypesSmall: {
            2: 'Amp',
            3: 'Bio',
            4: 'Tech',
            5: 'Lg Outpost',
            6: 'Sm Outpost',
            7: 'Warpgate',
            8: 'Interlink' // #BRING BACK THE INTERLINK
        },
        meta: {
            title: '',
            location: ''
        }
    };

    factory.convertFactionNameToInt = function(name) {
        name = name.toLowerCase();
        switch (name) {
            case 'VS':
                return 1;
            case 'NC':
                return 2;
            case 'TR':
                return 3;
            default:
                return null;
        }
    };

    factory.convertFactionIntToName = function(int) {
        switch (int) {
            case 1:
                return 'vs';
            case 2:
                return 'nc';
            case 3:
                return 'tr';
            default:
                return null;
        }
    };

    factory.update = function() {
        factory.location = factory.baseUrl + '/#' + $location.url();
    };

    $rootScope.$on('$routeChangeSuccess', factory.update);

    return factory;
});
