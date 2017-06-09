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
                vs: {
                    kills:     0,
                    deaths:    0,
                    suicides:  0,
                    teamkills: 0,
                    players:   0
                },
                nc: {
                    kills:     0,
                    deaths:    0,
                    suicides:  0,
                    teamkills: 0,
                    players:   0
                },
                tr: {
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
            factory.metrics = result[1];
            AlertTransformer.parse(result[1]).then(function(alert) {
                factory.details = alert;
                console.log('details', factory.details);

                // FIRE!!!
                factory.startProcessing().then(function() {
                    $rootScope.$broadcast('dataLoaded', 'loaded');
                    console.log(factory);

                    // Set off the KPM / DPM interval
                    if (factory.details.inProgress) {
                        var kpmInterval = setInterval(function() {
                            factory.processKpms().then(function() {
                                console.log('KPMs processed');
                                $('#player-leaderboard').DataTable().rows().invalidate().draw();
                                $('#outfit-leaderboard').DataTable().rows().invalidate().draw();
                                $('#weapon-leaderboard').DataTable().rows().invalidate().draw();
                            });
                        }, 30000);
                    }
                });
            });
        });
    };

    factory.startProcessing = function() {
        return new Promise(function(resolve) {
            var serverName = ConfigDataService.serverNames[factory.details.server];
            var winnerTitle = factory.details.winner.toUpperCase();

            if (!factory.details.winner) {
                winnerTitle = 'TBD';
            }

            $rootScope.changeTitle('Alert #' + factory.details.id + ' (' + factory.details.server + ' - ' + winnerTitle + ')');

            // Build player and outfit reference objects so we don't have to do
            // tons of loops on every single kill to get player / outfit info

            angular.forEach(factory.metrics.outfits.data, function(outfit) {
                factory.addNewOutfit(outfit).then(function() {
                    console.log('Initial Outfits Processed');
                });
            });

            angular.forEach(factory.metrics.players.data, function(player) {
                factory.addNewPlayer(player).then(function() {
                    console.log('Initial Players Processed');
                });
            });

            angular.forEach(factory.metrics.weapons.data, function(weapon) {
                factory.addNewWeapon(weapon).then(function() {
                    console.log('Initial Weapons Processed');
                });
            });

            angular.forEach(factory.metrics.vehicles.data, function(vehicle) {
                factory.addNewVehicle(vehicle).then(function() {
                    console.log('Initial Vehicles Processed');
                });;
            });

            angular.forEach(factory.metrics.maps.data, function(capture) {
                factory.addNewCapture(capture).then(function() {
                    console.log('Initial Map Captures Processed');
                });;
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

            resolve();
        });
    };

    // Function to add new players to various areas, grabbing new data from Census
    // or our API should we need to
    factory.addNewPlayer = function(player) {
        return new Promise(function(resolve) {
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

            factory.getOutfit(player.player.outfitID).then(function(outfit) {
                if (outfit) {
                    formatted.outfit    = outfit.name;
                    formatted.outfitTag = outfit.tag;
                } else {
                    console.log('Missing outfit ID "' + player.player.outfitID + '" for player: ' + formatted.id);
                    console.log(formatted);

                    formatted.outfit    = 'UNKNOWN',
                    formatted.outfitTag = null;
                }

                // Set faction abrivation
                formatted.factionAbv = ConfigDataService.convertFactionIntToName(formatted.faction);

                // Attach players to outfits. All players should have outfit IDs,
                // even -1, -2, -3 to denote different faction no outfits
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
                }

                formatted.kd = MetricsProcessingService.calcKD(formatted.kills, formatted.deaths); // Parse KD
                formatted.hsr = MetricsProcessingService.calcHSR(formatted.headshots, formatted.kills);
                formatted.kpm = (formatted.kills / factory.details.durationMins).toFixed(2);
                formatted.dpm = (formatted.deaths / factory.details.durationMins).toFixed(2);

                if (formatted.factionAbv !== null) {
                    factory.parsed.factions[formatted.factionAbv].players++;
                }

                factory.parsed.players.push(formatted);
                return resolve();
            });
        });
    };

    factory.addNewOutfit = function(outfit) {
        return new Promise(function(resolve) {
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

            if (!formatted.tag || formatted.tag.length === 0) {
                formatted.tag = null;
            }

            formatted.factionAbv = ConfigDataService.convertFactionIntToName(formatted.faction);
            formatted.kd = MetricsProcessingService.calcKD(formatted.kills, formatted.deaths); // Parse KD
            formatted.kpm = (formatted.kills / factory.details.durationMins).toFixed(2);
            formatted.dpm = (formatted.deaths / factory.details.durationMins).toFixed(2);

            factory.parsed.outfits.push(formatted);
            resolve();
        });
    };

    factory.addNewWeapon = function(weapon) {
        return new Promise(function(resolve) {
            if (weapon.id > 0) {
                // Find the array key for the weapon by ID
                var weaponRef = _.findIndex(
                    factory.configData.weapons.data, {'id': weapon.id}
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
                            name: weaponData.name + ' (Grouped)'
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
                    resolve();
                } else {
                    console.log('Invalid / Not found Weapon Data: ', weapon.id);
                }
            } else {
                console.log('Invalid Weapon ID: ', weapon.id);
            }
        });
    };

    factory.addNewVehicle = function(vehicle) {
        return new Promise(function(resolve) {
            if (vehicle.id > 0) {
                var vehicleRef = _.findIndex(
                    factory.configData.vehicles.data, {'id': vehicle.id}
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
                    resolve();
                } else {
                    console.log('Invalid Vehicle ID: ', vehicle.id);
                }
            }
        });
    };

    factory.addNewCapture = function(capture) {
        return new Promise(function(resolve) {
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

            var facilityConfRef = _.findIndex(
                factory.configData.facilities.data, {'id': capture.facilityID}
            );

            var facilityStatsRef = _.findIndex(
                factory.parsed.facilities, {'id': capture.facilityID}
            );

            if (capture.outfitCaptured && capture.outfitCaptured > 0) {
                console.log('capture.outfitCapured', capture.outfitCaptured);
                var outfitData = factory.getOutfit(capture.outfitCaptured);

                if (outfitData) {
                    formatted.outfitName = outfitData.name;
                    formatted.outfitTag  = outfitData.tag;

                    // Update outfit metrics
                    if (formatted.defence === true) {
                        outfitData.defences++;
                    } else {
                        outfitData.captures++;
                    }
                } else {
                    console.log('=== Outfit data could not be determined! ===');
                }
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
            resolve();
        });
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
            method: 'GET',
            url: ConfigDataService.apiUrl + '/data?embed=facilities,vehicles,weapons,xps'
        }).then(function(returned) {
            return resolve(returned.data.data);
        }, function(error) {
            alert('Was unable to load the page correctly (config data). Please refresh.');
            return reject(error);
        });
    });

    factory.getAlertData = function(alertID) {
        return new Promise(function(resolve, reject) {
            $http({
                method: 'GET',
                url: ConfigDataService.apiUrl + '/alerts/' + alertID + '?embed=classes,combats,combatHistorys,mapInitials,maps,outfits,players,populations,vehicles,weapons'
            }).then(function(returned) {
                return resolve(returned.data.data);
            }, function(error) {
                alert('Was unable to load the page correctly (config data). Please refresh.');
                return reject(error);
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
    };

    // Goes off and finds the references, and adds players if required
    factory.populateCombatPlayers = function(message) {
        return new Promise(function(resolve, reject) {
            // PROCESS ATTACKER
            // Find player records
            var attackerRef = _.findIndex(
                factory.parsed.players, {'id': message.attackerID}
            );
            var victimRef = _.findIndex(
                factory.parsed.players, {'id': message.victimID}
            );

            var attacker = factory.parsed.players[attackerRef];
            var victim = factory.parsed.players[victimRef];

            var promises = []; // Build an array of promises to execute
            var newAttacker = false;
            var newVictim = false;

            // If NOT found, supply the data to addNewPlayer
            if (!attacker) {
                var newPlayer = {};
                newPlayer.player = {
                    faction: message.attackerFaction,
                    id: message.attackerID,
                    name: message.attackerName,
                    outfitID: message.attackerOutfit.id
                };

                // Build metrics based on our new message
                newPlayer.metrics = {
                    kills: 1, // Attacker always gets this
                    deaths: 0, // Ditto
                    suicides: message.suicide === true ? 1 : 0, // Ditto
                    teamkills: message.teamkill === true ? 1 : 0,
                    headshots: message.headshot === true ? 1 : 0
                };

                // Send to addNewPlayer
                promises.push(factory.addNewPlayer(newPlayer));
                newAttacker = true;
            }

            if (!victim && message.attackerID !== message.victimID) {
                var newPlayer = {};
                newPlayer.player = {
                    faction: message.victimFaction,
                    id: message.victimID,
                    name: message.victimName,
                    outfitID: message.victimOutfit.id
                };

                // Build metrics based on our new message
                newPlayer.metrics = {
                    kills: 0, // Victim always gets this
                    deaths: 1, // Ditto
                    suicides: 0,
                    teamkills: 0,
                    headshots: 0
                };

                // Send to addNewPlayer
                promises.push(factory.addNewPlayer(newPlayer));
                newVictim = true;
            }

            if (promises.length > 0) {
                // If we've had to make changes, update the data we send back
                Promise.all(promises).then(function() {
                    attackerRef = _.findIndex(
                        factory.parsed.players, {'id': message.attackerID}
                    );
                    attacker = factory.parsed.players[attackerRef];
                    victimRef = _.findIndex(
                        factory.parsed.players, {'id': message.victimID}
                    );
                    victim = factory.parsed.players[victimRef];

                    if (!attacker || !victim) {
                        reject('Attacker or Victim could not be determined, EVEN AFTER PROMISE!');
                    }
                    resolve({
                        attacker: attacker,
                        victim: victim,
                        newAttacker: newAttacker,
                        newVictim: newVictim
                    });
                });
            } else {
                if (!attacker || !victim) {
                    reject('Attacker or Victim could not be determined!');
                }
                resolve({
                    attacker: attacker,
                    victim: victim,
                    newAttacker: newAttacker,
                    newVictim: newVictim
                });
            }
        });
    };

    factory.processPlayerMetrics = function(message) {
        return new Promise(function(resolve) {
            // Run promise to ENSURE that we get the correct player data, even if we have to insert it at this point
            Promise.all([
                factory.populateCombatPlayers(message)
            ]).then(function(result) {
                var attacker = result[0].attacker;
                var victim = result[0].victim;
                var newAttacker = result[0].newAttacker;
                var newVictim = result[0].newVictim;

                //console.log('Post promise attacker', attacker);
                //console.log('Post promise victim', victim);
                //

                // Now we're sure that their stats are in place, increase them!
                attacker.kills++;
                message.headshot === true ? attacker.kills++ : false;
                message.teamkill === true ? attacker.teamkills++ : false;

                attacker.kd = MetricsProcessingService.calcKD(attacker.kills, attacker.deaths); // Parse KD
                attacker.hsr = MetricsProcessingService.calcHSR(attacker.headshots, attacker.kills);
                attacker.kpm = (attacker.kills / factory.details.durationMins).toFixed(2);

                // Victim
                victim.deaths++;
                message.suicide === true ? victim.suicides++ : false;

                victim.kd = MetricsProcessingService.calcKD(victim.kills, victim.deaths); // Parse KD
                victim.dpm = (victim.deaths / factory.details.durationMins).toFixed(2);

                // Scan the table for the rows and invalidate only them (saves full redraws)
                var table = $('#player-leaderboard').DataTable();

                var row = table.rows(function(idx, data) {
                    if (data.id == attacker.id || data.id == victim.id) {
                        return true;
                    }
                    return false;
                }).invalidate();

                // If we have new data, we have to add them to the data table directly
                if (newAttacker) {
                    console.log('Added new attacker to leaderboard datatable');
                    $('#player-leaderboard').DataTable().row.add(attacker);
                }

                if (newVictim) {
                    console.log('Added new victim to leaderboard datatable');
                    $('#player-leaderboard').DataTable().row.add(victim);
                }

                // Redraw as we may have invalidated some rows
                $('#player-leaderboard').DataTable().draw('full-hold');

                resolve();
            });
        });
    };

    factory.processMapCapture = function(message) {
        factory.addNewCapture(message);
    };

    // Fires every 5 secs to update the KPMs / DPMs of every player, otherwise until they get a kill
    // they will always have the same. Promised so we're not redrawing on EVERY player
    factory.processKpms = function() {
        return new Promise(function(resolve) {
            console.log('Running KPMs');
            angular.forEach(factory.parsed.players, function(player) {
                player.kpm = (player.kills / factory.details.durationMins).toFixed(2);
                player.dpm = (player.deaths / factory.details.durationMins).toFixed(2);
            });
            angular.forEach(factory.parsed.outfits, function(outfit) {
                outfit.kpm = (outfit.kills / factory.details.durationMins).toFixed(2);
                outfit.dpm = (outfit.deaths / factory.details.durationMins).toFixed(2);
            });

            resolve();
        });
    };

    // Promise to get outfit details, either from current data or API
    factory.getOutfit = function(outfitID) {
        return new Promise(function(resolve, reject) {
            // Find the array key for the outfit by ID
            var outfitRef = _.findIndex(
                factory.parsed.outfits, {'id': outfitID}
            );

            // Pull the outfit data
            var outfit = factory.parsed.outfits[outfitRef];

            if (outfit) {
                resolve(outfit);
            } else {
                // Attempt to get data from API
                console.log('Local outfit #' + outfitID + ' not found... pulling from API');
                factory.getOutfitFromAPI(outfitID).then(function(data) {
                    console.log(outfitID);
                    if (!outfitID || outfitID == '0') {
                        console.log('Chucking out invalid ID');
                        reject('Invalid Outfit ID');
                    }
                    console.log('Got outfit #' + outfitID + ' from API', data);

                    // Add the outfit to the factory
                    var newOutfit = {
                        outfit: {
                            faction: data.faction,
                            id: data.id,
                            name: data.name,
                            tag: data.tag
                        },
                        metrics: {
                            deaths: 0,
                            kills: 0,
                            suicides: 0,
                            teamkills: 0
                        }
                    };

                    factory.addNewOutfit(newOutfit).then(function() {
                        var outfitRef = _.findIndex(
                            factory.parsed.outfits, {'id': outfitID}
                        );
                        console.log('Added new outfit #' + outfitID + ' to factory', factory.parsed.outfits[outfitRef]);

                        if (!outfitRef) {
                            console.log('UNABLE TO GET OUTFITREF!');
                            reject('Unable to get Outfit REF');
                        }

                        resolve(factory.parsed.outfits[outfitRef]);
                    });
                });
            }
        });
    };

    factory.getOutfitFromAPI = function(outfitID) {
        return new Promise(function(resolve, reject) {
            console.log('Pulling outfit #' + outfitID + ' from PS2Alerts API');
            $http({
                method: 'GET',
                url: ConfigDataService.apiUrl + '/data/outfit/' + outfitID
            }).then(function(returned) {
                resolve(returned.data.data);
            }, function(error) {
                console.log('Was unable to aquire outfit data from the API!');
                reject(error);
            });
        });
    };

    factory.processEndAlert = function(message) {
        console.log('Ending alert', message);

        factory.details.winner = message.winner.toLowerCase();
        factory.details.winnerText = ConfigDataService.factionsAlpha[message.winner.toLowerCase()];
        factory.details.ended = 1;
        factory.details.inProgress = false;
        factory.details.endedDate = $filter('date')(message.endTime, 'dd-MMM-yyyy HH:mm:ss');
        factory.details.duration = message.endTime - factory.details.started;
        factory.details.durationTime = $filter('date')(
            factory.details.duration,
            'HH:mm:ss',
            'UTC'
        );
        factory.details.durationMins = Math.round((factory.details.duration / 1000) / 60);

        // Cancel KPM calculations
        clearInterval(kpmInterval);
    };

    return factory;
});
