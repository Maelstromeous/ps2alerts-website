app.service('LeaderboardTopService', function(
    $http,
    $log,
    $rootScope,
    ConfigDataService
) {
    var factory = {};
    factory.limit = 50;

    factory.getConfig = function() {
        $rootScope.$broadcast('loading', 'blah');
        Promise.all([
            factory.getConfigData
        ]).then(function(result) {
            console.log('Config Promise completed', result);
            factory.configData = result[0];
            $rootScope.$broadcast('configReady', 'loaded');
        });
        console.log('Oh hai');
    }

    factory.getTopPlayers= function(server, sorting) {
        console.log('getting players for server', server);
        factory.playerData = {}; // Reset Data
        factory.playerServer = server;
        factory.playerSorting = sorting;

        var serverQuery = '&server='+server;
        var fieldQuery = 'field='+sorting;

        if (server === 0) {
            serverQuery = '';
        }

        $http({
            method : 'GET',
            url    : ConfigDataService.apiUrl + '/leaderboards/players?'+fieldQuery + serverQuery +'&limit=' + factory.limit
        }).then(function(returned) {
            factory.playerData = returned.data.data;

            factory.processPlayers(factory.playerData);
            $rootScope.$broadcast('players-loaded', server);
        });
    }

    factory.getTopOutfits= function(server, sorting) {
        console.log('getting outfits for server', server);
        factory.outfitData = {}; // Reset Data
        factory.outfitServer = server;
        factory.outfitSorting = sorting;

        var serverQuery = '&server='+server;
        var fieldQuery = 'field='+sorting;


        if (server === 0) {
            serverQuery = '';
        }

        $http({
            method : 'GET',
            url    : ConfigDataService.apiUrl + '/leaderboards/outfits?'+fieldQuery + serverQuery +'&limit=' + factory.limit
        }).then(function(returned) {
            factory.outfitData = returned.data.data;

            factory.processOutfits(factory.outfitData);
            $rootScope.$broadcast('outfits-loaded', server);
        });
    }

    factory.processPlayers = function(data) {
        var pos = 1;
        _.forEach(data, function(row, key) {
            row.pos = pos;
            pos++;

            row.outfitId = null;
            row.outfitName = '';
            row.outfitTag = null;

            if (row.outfit.id > 0) {
                row.outfitId = row.outfit.id;
                row.outfitName = row.outfit.name;
                row.outfitTag = null;
                if (row.outfit.tag) {
                    row.outfitTag = row.outfit.tag;
                }
            }

            row.kills     = row.kills.toLocaleString();
            row.deaths    = row.deaths.toLocaleString();
            row.teamkills = row.teamkills.toLocaleString();
            row.suicides  = row.suicides.toLocaleString();
            row.headshots = row.headshots.toLocaleString();

            row.factionAbv = ConfigDataService.convertFactionIntToName(row.faction);
            row.serverName = ConfigDataService.serverNames[row.server];
        });
    }

    factory.processOutfits = function(data) {
        var pos = 1;
        _.forEach(data, function(row, key) {
            row.pos = pos;
            pos++;

            row.kills     = row.kills.toLocaleString();
            row.deaths    = row.deaths.toLocaleString();
            row.teamkills = row.teamkills.toLocaleString();
            row.suicides  = row.suicides.toLocaleString();
            row.captures  = row.captures.toLocaleString();

            row.factionAbv = ConfigDataService.convertFactionIntToName(row.faction);
            row.serverName = ConfigDataService.serverNames[row.server];
        });
    }

    factory.getConfigData = new Promise(function(resolve, reject) {
        $http({
            method : 'GET',
            url    : ConfigDataService.apiUrl + '/data?embed=facilities,vehicles,weapons,xps'
        }).then(function(returned) {
            return resolve(returned.data.data);
        });
    });

    return factory;
});
