app.service('AlertMetricsService', function(
    $routeParams,
    $http,
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
                data: {}
            },
            combatHistorys: {
                data: {}
            },
            mapInitials: {
                data: {}
            },
            maps: {
                data: {}
            },
            outfits: {
                data: {}
            },
            players: {
                data: {}
            },
            populations: {
                data: {}
            },
            vehicles: {
                data: {}
            },
            weapons: {
                data: {}
            }
        };
        factory.references = {
            players: {},
            outfits: {}
        };

        ConfigDataService.setTitle("Alert #" + $routeParams.alert);

        console.log($routeParams.alert);
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

            factory.loaded.main = true;

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
            factory.loaded.players = true;

            console.log(factory);
        });
    };

    // Function to add new players to various areas, grabbing new data from Census
    // or our API should we need to
    factory.addNewPlayer = function(playerData) {
        var outfitID = playerData.player.outfitID;

        // Calculate KD
        playerData.metrics.kd =
        parseFloat((playerData.metrics.kills / playerData.metrics.deaths).toFixed(2));

        factory.references.players[playerData.player.id] = playerData;

        // Attach players to outfits. All players should have outfit IDs,
        // even -1, -2, -3 to denote different faction no outfits
        if (outfitID) {
            if (factory.references.outfits[outfitID]) {
                // Store a reference that this player is part of the outfit
                factory.references.outfits[outfitID].players.push(playerData.player.id);
            }
        } else {
            console.log('Missing outfit ID for player: ' + playerData.player.id);
            console.log(playerData);
        }
    };

    factory.addNewOutfit = function(outfitData) {
        outfitData.players = [];
        outfitData.metrics = {};
        factory.references.outfits[outfitData.outfit.id] = outfitData;
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
