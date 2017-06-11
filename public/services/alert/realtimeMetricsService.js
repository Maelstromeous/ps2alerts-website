app.service('RealtimeMetricsService', function(
    $http,
    $filter,
    AlertTransformer,
    AlertMetricsProcessingService,
    AlertWebsocketService,
    ConfigDataService,
    PS2AlertsAPIService,
    MetricsProcessingService
) {
    var alertFactory = {};
    var factory = {};

    factory.init = function(alertFactoryData) {
        alertFactory = alertFactoryData;

        // Alert Countdown && websocket subscription
        if (alertFactory.alert.ended == 0) {
            if (alertFactory.alert.inProgress) {
                // Subscribe to alert websocket
                AlertWebsocketService.initAndSubscribe(alertFactory.alert.id);

                // Set off the KPM / DPM interval
                var kpmInterval = setInterval(function() {
                    factory.processLeaderboardKpms().then(function() {
                        $('#player-leaderboard').DataTable().rows().invalidate().draw();
                        $('#outfit-leaderboard').DataTable().rows().invalidate().draw();
                        $('#weapon-leaderboard').DataTable().rows().invalidate().draw();
                    });
                }, 5000);
                var durationInterval = setInterval(function() {
                    var now = new Date().getTime();
                    alertFactory.alert.duration = now - alertFactory.alert.started;
                    alertFactory.alert.durationTime = $filter('date')(
                        alertFactory.alert.duration - 1, // -1 second due to Census lag
                        'HH:mm:ss',
                        'UTC'
                    );
                    alertFactory.alert.durationMins = Math.round((alertFactory.alert.duration / 1000) / 60);
                    factory.recalculateMetricKpms();
                }, 1000);
            }
        }
    };

    factory.increaseCombatKills = function(message) {
        if (message.suicide === true) {
            alertFactory.metrics.combat.suicides[message.attackerFactionAbv]++;
            alertFactory.metrics.combat.suicides.total++;
        }

        if (message.teamkill === true) {
            alertFactory.metrics.combat.teamkills[message.attackerFactionAbv]++;
            alertFactory.metrics.combat.teamkills.total++;
        }

        // If a suicide or a TK, don't give the attacker credit
        if (message.suicide === false && message.teamkill === false) {
            alertFactory.metrics.combat.kills[message.attackerFactionAbv]++;
            alertFactory.metrics.combat.kills.total++;
        }

        alertFactory.metrics.combat.deaths[message.victimFactionAbv]++;
        alertFactory.metrics.combat.deaths.total++;
    };

    // Goes off and finds the references, and adds players if required
    factory.populateCombatPlayers = function(message) {
        return new Promise(function(resolve, reject) {
            // PROCESS ATTACKER
            // Find player records
            var attackerRef = _.findIndex(
                alertFactory.metrics.players, {'id': message.attackerID}
            );
            var victimRef = _.findIndex(
                alertFactory.metrics.players, {'id': message.victimID}
            );

            var attacker = alertFactory.metrics.players[attackerRef];
            var victim = alertFactory.metrics.players[victimRef];

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
                promises.push(AlertMetricsProcessingService.addNewPlayer(newPlayer));
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
                promises.push(alertFactory.addNewPlayer(newPlayer));
                newVictim = true;
            }

            if (promises.length > 0) {
                // If we've had to make changes, update the data we send back
                Promise.all(promises).then(function() {
                    attackerRef = _.findIndex(
                        alertFactory.metrics.players, {'id': message.attackerID}
                    );
                    attacker = alertFactory.metrics.players[attackerRef];
                    victimRef = _.findIndex(
                        alertFactory.metrics.players, {'id': message.victimID}
                    );
                    victim = alertFactory.metrics.players[victimRef];

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

    factory.updatePlayerMetrics = function(message) {
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
                attacker.kpm = (attacker.kills / alertFactory.alert.durationMins).toFixed(2);

                // Victim
                victim.deaths++;
                message.suicide === true ? victim.suicides++ : false;

                victim.kd = MetricsProcessingService.calcKD(victim.kills, victim.deaths); // Parse KD
                victim.dpm = (victim.deaths / alertFactory.alert.durationMins).toFixed(2);

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
                    $('#player-leaderboard').DataTable().row.add(attacker);
                }

                if (newVictim) {
                    $('#player-leaderboard').DataTable().row.add(victim);
                }

                // Redraw as we may have invalidated some rows
                $('#player-leaderboard').DataTable().draw('full-hold');

                resolve();
            });
        });
    };

    factory.updateOutfitMetrics = function(message) {
        return new Promise(function(resolve) {
            if (message.attackerOutfit.id && message.attackerOutfit.id != 0) {
                alertFactory.getOutfit(message.attackerOutfit.id).then(function(outfit) {
                    if (!outfit) {
                        console.log('getOutfit returned nothing for Attacker Outfit');
                        return false;
                    }

                    // Increment kills / deaths based on message
                    // Suicides will be handled at victim level
                    if (message.attackerID !== message.victimID) {
                        outfit.kills++;
                    }

                    if (message.teamkill === true) {
                        outfit.teamkills++;
                    }

                    // Update outfit metrics
                    outfit.kd = MetricsProcessingService.calcKD(outfit.kills, outfit.deaths);
                    outfit.killsPerParticipant = (outfit.kills / outfit.participants).toFixed(2);
                    outfit.deathsPerParticipant = (outfit.deaths / outfit.participants).toFixed(2);
                });
            }

            if (message.victimOutfit.id && message.victimOutfit.id != 0) {
                alertFactory.getOutfit(message.victimOutfit.id).then(function(outfit) {
                    if (!outfit) {
                        console.log('getOutfit returned nothing for Victim Outfit');
                        return false;
                    }
                    // Increment kills / deaths based on message
                    // Suicides will be handled at victim level
                    outfit.deaths++;

                    if (message.suicide === true) {
                        outfit.deaths++;
                        outfit.suicides++;
                    }

                    // Update outfit metrics
                    outfit.kd = MetricsProcessingService.calcKD(outfit.kills, outfit.deaths);
                    outfit.killsPerParticipant = (outfit.kills / outfit.participants).toFixed(2);
                    outfit.deathsPerParticipant = (outfit.deaths / outfit.participants).toFixed(2);
                });
            }

            $('#outfit-leaderboard').DataTable().rows().invalidate().draw();
            resolve();
        });
    };

    factory.updateWeaponMetrics = function(message) {
        return new Promise(function(resolve, reject) {
            console.log('updateWeaponMetrics');
            console.log(message);
        });
    };

    factory.processMapCapture = function(message) {
        AlertMetricsProcessingService.addNewCapture(message);
    };

    factory.recalculateMetricKpms = function() {
        alertFactory.metrics.kpms = {
            total: (alertFactory.metrics.combat.kills.total / alertFactory.alert.duration) * 1000 * 60,
            vs: (alertFactory.metrics.combat.kills.vs / alertFactory.alert.duration) * 1000 * 60,
            nc: (alertFactory.metrics.combat.kills.nc / alertFactory.alert.duration) * 1000 * 60,
            tr: (alertFactory.metrics.combat.kills.tr / alertFactory.alert.duration) * 1000 * 60,
        };

        alertFactory.metrics.dpms = {
            total: (alertFactory.metrics.combat.deaths.total / alertFactory.alert.duration) * 1000 * 60,
            vs: (alertFactory.metrics.combat.deaths.vs / alertFactory.alert.duration) * 1000 * 60,
            nc: (alertFactory.metrics.combat.deaths.nc / alertFactory.alert.duration) * 1000 * 60,
            tr: (alertFactory.metrics.combat.deaths.tr / alertFactory.alert.duration) * 1000 * 60,
        };
    };

    // Fires every 5 secs to update the KPMs / DPMs of every player, otherwise until they get a kill
    // they will always have the same. Promised so we're not redrawing on EVERY player
    factory.processLeaderboardKpms = function() {
        return new Promise(function(resolve) {
            angular.forEach(alertFactory.metrics.players, function(player) {
                player.kpm = (player.kills / alertFactory.alert.durationMins).toFixed(2);
                player.dpm = (player.deaths / alertFactory.alert.durationMins).toFixed(2);
            });
            angular.forEach(alertFactory.metrics.outfits, function(outfit) {
                outfit.kpm = (outfit.kills / alertFactory.alert.durationMins).toFixed(2);
                outfit.dpm = (outfit.deaths / alertFactory.alert.durationMins).toFixed(2);
            });

            resolve();
        });
    };

    return factory;
});
