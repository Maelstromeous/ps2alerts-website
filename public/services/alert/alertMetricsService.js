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

        angular.forEach(factory.metrics.weapons.data, function(weapon) {
            factory.addNewWeapon(weapon);
        });

        // Sort the data
        factory.sortPlayers('kills');

        $rootScope.$broadcast('dataLoaded', 'loaded');

        console.log(factory);
    };

    // Function to add new players to various areas, grabbing new data from Census
    // or our API should we need to
    factory.addNewPlayer = function(player) {
        // Find the array key for the outfit by ID
        var outfitRef = _.findIndex(
            factory.parsed.outfits, { 'id' : player.player.outfitID }
        );

        var outfit = factory.parsed.outfits[outfitRef];

        var formatted = {
            id:        player.player.id,
            name:      player.player.name,
            outfit:    outfit.name,
            outfitTag: outfit.tag,
            faction:   player.player.faction,
            kills:     player.metrics.kills,
            deaths:    player.metrics.deaths,
            teamkills: player.metrics.teamkills,
            suicides:  player.metrics.suicides,
            headshots: player.metrics.headshots
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

            // Nullify participants if less than 5 people so that K/D ratios are more accurate
            if (outfit.participants < 5) {
                outfit.kd = 0;
            } else {
                outfit.kd = factory.returnKD(outfit);
            }
        } else {
            console.log('Missing outfit ID for player: ' + formatted.id);
            console.log(formatted);
        }

        formatted.kd = factory.returnKD(formatted); // Parse KD
        factory.parsed.players.push(formatted);
    };

    factory.addNewOutfit = function(outfit) {
        var formatted = {
            id:           outfit.outfit.id,
            name:         outfit.outfit.name,
            tag:          outfit.outfit.tag,
            faction:      outfit.outfit.faction,
            kills:        outfit.metrics.kills,
            deaths:       outfit.metrics.deaths,
            teamkills:    outfit.metrics.teamkills,
            suicides:     outfit.metrics.suicides,
            players:      [], // Will store all playerIDs for reference
            participants: 0
        };

        if (formatted.tag.length === 0) {
            formatted.tag = null;
        }

        formatted.kd = factory.returnKD(formatted); // Parse KD

        // Set faction abrivation
        formatted.factionAbv = ConfigDataService.convertFactionIntToName(formatted.faction);

        factory.parsed.outfits.push(formatted);
    };

    factory.addNewWeapon = function(weapon) {
        if (weapon.id > 0) {
            // Find the array key for the weapon by ID
            var weaponRef = _.findIndex(
                factory.configData.weapons.data, {'id' : weapon.id}
            );

            var weaponData = factory.configData.weapons.data[weaponRef];

            if (weaponData) {
                // Do a check to see if the weapon we have, by name, is
                // already in the data array. This is to merge the cross faction
                // vehicle weapons into a singular weapon
                var index = _.findIndex(
                    factory.parsed.weapons, {'name': weaponData.name}
                );

                // If weapon by name has been found, check if we have a special
                // fake weapon for the group

                var groupIndex = _.findIndex(
                    factory.parsed.weapons, {
                        'name'   : weaponData.name + ' (Grouped)'
                    }
                );

                // If there is no faked "group" weapon
                if (groupIndex === -1 && index !== -1) {
                    var existingWeapon = factory.parsed.weapons[index];
                    var random = Math.floor(Math.random() * 10000);

                    var newGroup = {
                        id:         weapon.id + '00000' + random, // Randomly scrable the ID
                        name:       weaponData.name + ' (Grouped)',
                        kills:      (weapon.kills + existingWeapon.kills),
                        teamkills:  (weapon.teamkills + existingWeapon.teamkills),
                        headshots:  (weapon.headshots + existingWeapon.headshots),
                        vehicle:    weaponData.isVehicle,
                        faction:    0,
                        factionAbv: 'grouped',
                        weapons:    [weapon.id]
                    };

                    factory.parsed.weapons.push(newGroup);
                }

                // Else, if the grouped weapon was indeed found, increase it's stats
                if (groupIndex !== -1) {
                    var weaponGroup = factory.parsed.weapons[groupIndex];

                    weaponGroup.kills     += weapon.kills;
                    weaponGroup.teamkills += weapon.kills;
                    weaponGroup.headshots += weapon.headshots;
                    weaponGroup.faction    = 0;

                    weaponGroup.weapons.push(weapon.id); // Push this weapon to the group
                }

                // Continue adding the weapon as a single entity
                var formatted = {
                    id:        weapon.id,
                    name:      weaponData.name,
                    kills:     weapon.kills,
                    teamkills: weapon.teamkills,
                    headshots: weapon.headshots,
                    vehicle:   weaponData.isVehicle,
                    faction:   weaponData.faction
                };

                // Set faction abrivation
                formatted.factionAbv = ConfigDataService.convertFactionIntToName(formatted.faction);

                factory.parsed.weapons.push(formatted);
            } else {
                console.log("DUFF DATA", weapon.id);
            }
        }
    };

    // Calculate KD
    factory.returnKD = function(data) {
        var kd =
        parseFloat((data.kills / data.deaths).toFixed(2));

        if (kd == 'Infinity' || isNaN(kd)) {
            kd = data.kills;
        }

        return kd;
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
    });

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
