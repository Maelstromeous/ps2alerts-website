app.service('AlertMetricsService', function(
    $routeParams,
    $http,
    $rootScope,
    $filter,
    AlertTransformer,
    ConfigDataService,
    MetricsProcessingService
) {
    var factory = {};

    factory.init = function(alertID) {
        $rootScope.changeTitle('Alert #' + alertID);
        factory.details = {};
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
            weapons:  [],
            map: {
                captures: [],
                defences: [],
                all: []
            },
            facilities: [],
            factions: {
                'vs': {
                    kills:     0,
                    deaths:    0,
                    suicides:  0,
                    teamkills: 0,
                    players:   0
                },
                'nc': {
                    kills:     0,
                    deaths:    0,
                    suicides:  0,
                    teamkills: 0,
                    players:   0
                },
                'tr': {
                    kills:     0,
                    deaths:    0,
                    suicides:  0,
                    teamkills: 0,
                    players:   0
                }
            }
        };

        // Fire off the queries required to get the data
        Promise.all([
            factory.getConfigData,
            factory.getAlertData(alertID)
        ]).then(function(result) {
            factory.configData = result[0];
            // FIRE
            factory.startProcessing(result[1]);
        });
    };

    factory.startProcessing = function(data) {
        factory.details = AlertTransformer.parse(data);
        factory.metrics = data;

        var serverName = ConfigDataService.serverNames[factory.details.server];
        var winnerTitle = factory.details.winner.toUpperCase();

        if (!factory.details.winner) {
            winnerTitle = 'TBD';
        }

        $rootScope.changeTitle('Alert #' + factory.details.id + ' (' + factory.details.server + ' - ' + winnerTitle + ')');

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

        angular.forEach(factory.metrics.vehicles.data, function(vehicle) {
            factory.addNewVehicle(vehicle);
        });

        angular.forEach(factory.metrics.maps.data, function(capture) {
            factory.addNewCapture(capture);
        });

        // Sort the data
        factory.sortPlayers('kills');
        factory.sortFacilities('captures');

        angular.forEach(ConfigDataService.factions, function(faction) {
            if (faction !== 'draw') {
                factory.parsed.factions[faction].kills     = factory.metrics.combats.data.kills[faction];
                factory.parsed.factions[faction].deaths    = factory.metrics.combats.data.deaths[faction];
                factory.parsed.factions[faction].teamkills = factory.metrics.combats.data.teamkills[faction];
                factory.parsed.factions[faction].suicides  = factory.metrics.combats.data.suicides[faction];
            }
        });

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
            faction:   player.player.faction,
            kills:     player.metrics.kills,
            deaths:    player.metrics.deaths,
            teamkills: player.metrics.teamkills,
            suicides:  player.metrics.suicides,
            headshots: player.metrics.headshots
        };

        if (outfit) {
            formatted.outfit    = outfit.name;
            formatted.outfitTag = outfit.tag;
        } else {
            formatted.outfit    = 'UNKNOWN',
            formatted.outfitTag = null;
        }

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

            // Nullify participants if less than 6 people so that K/D ratios are more accurate
            if (outfit.participants < 6 && factory.details.timeBracket === 'Prime Time') {
                outfit.kd = 0;
            } else {
                outfit.kd = MetricsProcessingService.calcKD(outfit.kills, outfit.deaths);
                outfit.killsPerParticipant = (outfit.kills / outfit.participants).toFixed(2);
                outfit.deathsPerParticipant = (outfit.deaths / outfit.participants).toFixed(2);
            }
        } else {
            console.log('Missing outfit ID for player: ' + formatted.id);
            console.log(formatted);
        }

        formatted.kd = MetricsProcessingService.calcKD(formatted.kills, formatted.deaths); // Parse KD
        formatted.hsr = MetricsProcessingService.calcHSR(formatted.headshots, formatted.kills);
        formatted.kpm = (formatted.kills / factory.details.durationMins).toFixed(2);
        formatted.dpm = (formatted.deaths / factory.details.durationMins).toFixed(2);

        if (formatted.factionAbv !== null) {
            factory.parsed.factions[formatted.factionAbv].players++;
        }

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
            participants: 0,
            killsPerParticipant: 0,
            deathsPerParticipant: 0,
            captures: 0
        };

        if (formatted.tag.length === 0) {
            formatted.tag = null;
        }

        formatted.factionAbv = ConfigDataService.convertFactionIntToName(formatted.faction);
        formatted.kd = MetricsProcessingService.calcKD(formatted.kills, formatted.deaths); // Parse KD
        formatted.kpm = (formatted.kills / factory.details.durationMins).toFixed(2);
        formatted.dpm = (formatted.deaths / factory.details.durationMins).toFixed(2);

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
                // Do a check to see if the weapon we have, by name, is already in the data array. This is to merge the
                // cross faction vehicle weapons into a singular weapon
                var index = _.findIndex(
                    factory.parsed.weapons, {'name': weaponData.name}
                );

                // If weapon by name has been found, check if we have a special fake weapon for the group
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
                        id:         weapon.id + '00000' + random, // Scramble the ID
                        name:       weaponData.name + ' (Grouped)',
                        kills:      (weapon.kills + existingWeapon.kills),
                        teamkills:  (weapon.teamkills + existingWeapon.teamkills),
                        headshots:  (weapon.headshots + existingWeapon.headshots),
                        vehicle:    weaponData.isVehicle,
                        faction:    0,
                        factionAbv: 'grouped',
                        weapons:    [weapon.id]
                    };

                    newGroup.hsr = MetricsProcessingService.calcHSR(newGroup.headshots, newGroup.kills);
                    newGroup.kpm = (newGroup.kills / factory.details.durationMins).toFixed(2);
                    newGroup.dpm = (newGroup.deaths / factory.details.durationMins).toFixed(2);

                    factory.parsed.weapons.push(newGroup);
                }

                // Else, if the grouped weapon was indeed found, increase it's stats
                if (groupIndex !== -1) {
                    var weaponGroup = factory.parsed.weapons[groupIndex];

                    weaponGroup.kills     += weapon.kills;
                    weaponGroup.teamkills += weapon.teamkills;
                    weaponGroup.headshots += weapon.headshots;
                    weaponGroup.faction    = 0;

                    weaponGroup.hsr = MetricsProcessingService.calcHSR(weaponGroup.headshots, weaponGroup.kills);
                    weaponGroup.kpm = (weaponGroup.kills / factory.details.durationMins).toFixed(2);
                    weaponGroup.dpm = (weaponGroup.deaths / factory.details.durationMins).toFixed(2);

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

                formatted.hsr = MetricsProcessingService.calcHSR(formatted.headshots, formatted.kills);
                formatted.kpm = (formatted.kills / factory.details.durationMins).toFixed(2);
                formatted.dpm = (formatted.deaths / factory.details.durationMins).toFixed(2);

                factory.parsed.weapons.push(formatted);
            } else {
                console.log("Invalid Weapon ID: ", weapon.id);
            }
        }
    };

    factory.addNewVehicle = function(vehicle) {
        if (vehicle.id > 0) {
            var vehicleRef = _.findIndex(
                factory.configData.vehicles.data, {'id' : vehicle.id}
            );

            if (vehicleRef !== -1) {
                var vehicleData = factory.configData.vehicles.data[vehicleRef];

                var formatted = {
                    id:      vehicle.id,
                    name:    vehicleData.name,
                    type:    vehicleData.type,
                    faction: vehicleData.faction,
                    kills:   vehicle.kills.total,
                    killsI:  vehicle.kills.infantry,
                    killsV:  vehicle.kills.vehicle,
                    deaths:  vehicle.deaths.total,
                    deathsI: vehicle.deaths.infantry,
                    deathsV: vehicle.deaths.vehicle,
                    bails:   vehicle.bails
                };

                formatted.factionAbv = ConfigDataService.convertFactionIntToName(formatted.faction);

                formatted.kd = MetricsProcessingService.calcKD(formatted.kills, formatted.deaths); // Parse KD
                formatted.kpm = (formatted.kills / factory.details.durationMins).toFixed(2);
                formatted.dpm = (formatted.deaths / factory.details.durationMins).toFixed(2);

                factory.parsed.vehicles.push(formatted);
            } else {
                console.log("Invalid Vehicle ID: ", vehicle.id);
            }
        }
    };

    factory.addNewCapture = function(capture) {
        var formatted = {
            timestamp: capture.timestamp * 1000,
            defence:   capture.isDefence,
            vs:        parseInt(capture.controlVS),
            nc:        parseInt(capture.controlNC),
            tr:        parseInt(capture.controlTR),
            captor:    capture.facilityNewFaction,
            looser:    capture.facilityOldFaction
        };

        formatted.total = (formatted.vs + formatted.nc + formatted.tr);
        formatted.neutral = 100 - formatted.total;

        var outfitRef = _.findIndex(
            factory.parsed.outfits, {'id' : capture.outfitCaptured}
        );

        var facilityConfRef = _.findIndex(
            factory.configData.facilities.data, {'id' : capture.facilityID}
        );

        var facilityStatsRef = _.findIndex(
            factory.parsed.facilities, {'id' : capture.facilityID}
        );

        if (outfitRef !== -1) {
            var outfitData = factory.parsed.outfits[outfitRef];
            formatted.outfitName = outfitData.name;
            formatted.outfitTag  = outfitData.tag;

            // Update outfit metrics
            if (formatted.defence === true) {
                outfitData.defences++;
            } else {
            outfitData.captures++;
            }
        } else {
            console.log('Outfit info missing!', capture.outfitCaptured);
        }

        if (facilityConfRef !== -1) {
            var facility = factory.configData.facilities.data[facilityConfRef];
            formatted.facilityId    = facility.id;
            formatted.facilityName  = facility.name;
            formatted.facilityType  = facility.type;
            formatted.facilityMapId = facility.mapId;

            // Create new facility stats entry
            if (facilityStatsRef === -1) {
                var newFacility = {
                    id: facility.id,
                    name: facility.name,
                    type: ConfigDataService.facilityTypes[facility.type],
                    typeSmall: ConfigDataService.facilityTypesSmall[facility.type],
                    captures: 0,
                    defences: 0,
                };

                if (formatted.defence === true) {
                    newFacility.defences = 1;
                } else {
                    newFacility.captures = 1;
                }

                factory.parsed.facilities.push(newFacility);
            } else { // Update facility stats entry
                var entry = factory.parsed.facilities[facilityStatsRef];
                if (formatted.defence === true) {
                    entry.defences++;
                } else {
                    entry.captures++;
                }
            }
        }

        formatted.dateTime = $filter('date')(formatted.timestamp, 'HH:mm:ss');

        formatted.captorFactionAbv = ConfigDataService.convertFactionIntToName(formatted.captor);
        formatted.looserFactionAbv = ConfigDataService.convertFactionIntToName(formatted.looser);

        if (formatted.defence === true) {
            factory.parsed.map.defences.push(formatted);
        } else {
            factory.parsed.map.captures.push(formatted);
        }

        factory.parsed.map.all.push(formatted);

        // Update territory bar
        factory.controlVS = formatted.vs;
        factory.controlNC = formatted.nc;
        factory.controlTR = formatted.tr;
        factory.controlNeutral = formatted.neutral;
    };

    factory.sortPlayers = function(metric) {
        factory.sortPlayersByMetric(factory.metrics.players.data, metric);
    };

    factory.sortFacilities = function(metric) {
        factory.sortFacilitiesByMetric(factory.parsed.facilities, metric);
    };

    // Look into extracting this logic into a new function at some point
    factory.sortFacilitiesByMetric = function(object, metric) {
        object.sort(function(fac1, fac2) {
            if (fac1[metric] < fac2[metric]) {
                return 1;
            }
            if (fac1[metric] > fac2[metric]) {
                return -1;
            }

            // If the metrics are exact, make sure to sort by defences
            if (fac1[metric] === fac2[metric]) {
                if (fac1.defences < fac2.defences) {
                    return 1;
                }

                if (fac1.defences > fac2.defences) {
                    return -1;
                }

                // If they are also the same, sort by name
                if (fac1.name > fac2.name) {
                    return 1;
                }
                return -1;
            }
            return 0;
        });
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

    factory.increaseCombatKills = function(message) {
        var combatStats = factory.metrics.combats.data;
        if (message.suicide === true) {
            combatStats.suicides[message.attackerFactionAbv]++;
            combatStats.suicides.total++;
        }

        if (message.teamkill === true) {
            combatStats.teamkills[message.attackerFactionAbv]++;
            combatStats.teamkills.total++;
        }

        // If a suicide or a TK, don't give the attacker credit
        if (message.suicide === false && message.teamkill === false) {
            combatStats.kills[message.attackerFactionAbv]++;
            combatStats.kills.total++;
        }

        combatStats.deaths[message.victimFactionAbv]++;
        combatStats.deaths.total++;
    }

    factory.processMapCapture = function(message) {
        factory.addNewCapture(message);
    }

    return factory;
});
