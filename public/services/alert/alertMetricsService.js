app.service('AlertMetricsService', function(
    $routeParams,
    $http,
    $rootScope,
    AlertTransformer,
    ConfigDataService
) {
    var factory = {};

    factory.init = function(alertID) {
        factory.details = {};
        factory.lastMap = {};
        factory.configData  = {};
        factory.metrics = {
            combats: {
                data: []
            },
            combatHistorys: {
                data: []
            },
            mapInitials: {
                data: []
            },
            maps: {
                data: []
            },
            outfits: {
                data: []
            },
            players: {
                data: []
            },
            populations: {
                data: []
            },
            vehicles: {
                data: []
            },
            weapons: {
                data: []
            }
        };

        // Holds flattened versions of the data for datatables
        factory.parsed = {
            players:  [],
            outfits:  [],
            vehicles: [],
            weapons:  []
        };

        ConfigDataService.setTitle("Alert #" + alertID);

        // Fire off the queries required to get the data
        var promise = Promise.all([factory.getConfigData, factory.getAlertData(alertID)]).then(function(result) {
            console.log('Promise completed', result);
            factory.configData = result[0];
            // FIRE
            factory.startProcessing(result[1]);
        });
    };

    factory.startProcessing = function(data) {
        var details = {
            started:     data.started,
            ended:       data.ended,
            timeBracket: data.timeBracket,
            server:      data.server,
            zone:        data.zone,
            winner:      data.winner
        };

        factory.details = AlertTransformer.parse(details);
        factory.metrics = data;

        factory.lastMap = _.last(data.maps.data);

        var last = factory.lastMap;
        last.controlTotal = last.controlVS + last.controlNC + last.controlTR;
        last.controlNeutral = 100 - last.controlTotal;

        // Build player and outfit reference objects so we don't have to do
        // tons of loops on every single kill to get player / outfit info

        angular.forEach(factory.metrics.outfits.data, function(outfit) {
            factory.addNewOutfit(outfit);
        });

        angular.forEach(factory.metrics.players.data, function(player) {
            factory.addNewPlayer(player);
        });

        // Sort the data
        factory.sortPlayers('kills');

        $rootScope.$broadcast('dataLoaded', 'loaded');
    }

    // Function to add new players to various areas, grabbing new data from Census
    // or our API should we need to
    factory.addNewPlayer = function(playerData) {
        // Find the array key for the outfit by ID
        var outfitRef = _.findIndex(
            factory.parsed.outfits, { 'id' : playerData.player.outfitID }
        );

        var outfit = factory.parsed.outfits[outfitRef];

        var formatted = {
            id:        playerData.player.id,
            name:      playerData.player.name,
            outfit:    outfit.name,
            outfitTag: outfit.tag,
            faction:   playerData.player.faction,
            kills:     playerData.metrics.kills,
            deaths:    playerData.metrics.deaths,
            teamkills: playerData.metrics.teamkills,
            suicides:  playerData.metrics.suicides,
            headshots: playerData.metrics.headshots
        };

        // Set faction abrivation
        formatted.factionAbv = ConfigDataService.convertFactionIntToName(formatted.faction);

        // Attach players to outfits. All players should have outfit IDs,
        // even -1, -2, -3 to denote different faction no outfits
        //
        // WILL NEED TO HANDLE IN THE FUTURE WHEN WE ADD NEW PLAYERS TO ADD THEIR OUTFIT INFO
        if (outfit) {
            // Store a reference that this player is part of the outfit
            outfit.players.push(formatted.id);
            outfit.participants = outfit.players.length;
        } else {
            console.log('Missing outfit ID for player: ' + formatted.id);
            console.log(formatted);
        }

        formatted = factory.returnKD(formatted); // Parse KD
        factory.parsed.players.push(formatted);
    };

    factory.addNewOutfit = function(outfitData) {
        var formatted = {
            id:           outfitData.outfit.id,
            name:         outfitData.outfit.name,
            tag:          outfitData.outfit.tag,
            faction:      outfitData.outfit.faction,
            kills:        outfitData.metrics.kills,
            deaths:       outfitData.metrics.deaths,
            teamkills:    outfitData.metrics.teamkills,
            suicides:     outfitData.metrics.suicides,
            players:      [], // Will store all playerIDs for reference
            participants: 0
        };

        if (formatted.tag.length === 0) {
            formatted.tag = null;
        }

        formatted = factory.returnKD(formatted); // Parse KD

        // Set faction abrivation
        formatted.factionAbv = ConfigDataService.convertFactionIntToName(formatted.faction);

        factory.parsed.outfits.push(formatted);
    };

    factory.addNewWeapon = function(weaponData) {
        var formatted = {

        }
    }

    // Calculate KD
    factory.returnKD = function(data) {
        data.kd =
        parseFloat((data.kills / data.deaths).toFixed(2));

        if (data.kd == 'Infinity' || isNaN(data.kd)) {
            data.kd = data.kills;
        }

        return data;
    };

    factory.sortPlayers = function(metric) {
        factory.sortPlayersByMetric(factory.metrics.players.data, 'kills');
    };

    // Function to sort players metrics
    factory.sortPlayersByMetric = function(object, metric) {
        object.sort(function(p1, p2) {
            if (p1.metrics[metric] < p2.metrics[metric]) {
                return 1;
            }
            if (p1.metrics[metric] > p2.metrics[metric]) {
                return -1;
            }

            // If the metrics are exact, make sure to sort by name
            if (p1.metrics[metric] === p2.metrics[metric]) {
                if (p1.player.name > p2.player.name) {
                    return 1;
                }
                return -1;
            }
            return 0;
        });
    };

    factory.getConfigData = new Promise(function(resolve, reject) {
        $http({
            method : 'GET',
            url    : ConfigDataService.apiUrl + '/data?embed=facilities,vehicles,weapons,xps'
        }).then(function(returned) {
            return resolve(returned.data.data);
        });
    })

    factory.getAlertData = function(alertID) {
        return new Promise(function(resolve, reject) {
            $http({
                method : 'GET',
                url    : ConfigDataService.apiUrl + '/alerts/' + alertID + '?embed=classes,combats,combatHistorys,mapInitials,maps,outfits,players,populations,vehicles,weapons'
            }).then(function(returned) {
                return resolve(returned.data.data);
            });
        });
    };

    return factory;
});
