app.service('AlertMetricsService', function(
    $routeParams,
    $http,
    $rootScope,
    AlertTransformer,
    ConfigDataService
) {
    var factory = {};

    factory.init = function() {
        factory.loaded = {
            main: false,
            players: false,
            outfits: false
        };
        factory.details = {};
        factory.lastMap = {};
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
            players: [],
            outfits: {},
            vehicles: {},
            weapons: {}
        };

        ConfigDataService.setTitle("Alert #" + $routeParams.alert);

        $http({
            method : 'GET',
            url    : ConfigDataService.apiUrl + '/alerts/' + $routeParams.alert + '?embed=classes,combats,combatHistorys,mapInitials,maps,outfits,players,populations,vehicles,weapons'
        }).then(function(data) {
            var returned = data.data.data; // #Dataception

            var details = {
                started:     returned.started,
                ended:       returned.ended,
                timeBracket: returned.timeBracket,
                server:      returned.server,
                zone:        returned.zone,
                winner:      returned.winner
            };

            factory.details = AlertTransformer.parse(details);
            factory.metrics = returned;

            factory.lastMap = _.last(returned.maps.data);

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

            console.log(factory);
        });
    };

    // Function to add new players to various areas, grabbing new data from Census
    // or our API should we need to
    factory.addNewPlayer = function(playerData) {
        var outfitID = playerData.player.outfitID;
        var outfit = factory.parsed.outfits[outfitID];

        var formatted = {
            id: playerData.player.id,
            name: playerData.player.name,
            outfit: outfit.outfit.name,
            outfitTag: outfit.outfit.tag,
            faction: playerData.player.faction,
            kills: playerData.metrics.kills,
            deaths: playerData.metrics.deaths,
            teamkills: playerData.metrics.teamkills,
            suicides: playerData.metrics.suicides,
            headshots: playerData.metrics.headshots
        };

        // Calculate KD (this is added directly to the data object as we're working
        // in references)
        formatted.kd =
        parseFloat((formatted.kills / formatted.deaths).toFixed(2));

        if (formatted.kd == 'Infinity' || isNaN(formatted.kd)) {
            formatted.kd = formatted.kills;
        }

        // Set faction abrivation
        formatted.factionAbv = ConfigDataService.convertFactionIntToName(formatted.faction);

        // Attach players to outfits. All players should have outfit IDs,
        // even -1, -2, -3 to denote different faction no outfits
        //
        // WILL NEED TO HANDLE IN THE FUTURE WHEN WE ADD NEW PLAYERS TO ADD THEIR OUTFIT INFO
        if (outfitID) {
            if (factory.parsed.outfits[outfitID]) {
                // Store a reference that this player is part of the outfit
                factory.parsed.outfits[outfitID].players.push(formatted.id);
            }
        } else {
            console.log('Missing outfit ID for player: ' + formatted.id);
            console.log(formatted);
        }

        factory.parsed.players.push(formatted);
    };

    factory.addNewOutfit = function(outfitData) {
        outfitData.players = [];
        factory.parsed.outfits[outfitData.outfit.id] = outfitData;
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

    return factory;
});
