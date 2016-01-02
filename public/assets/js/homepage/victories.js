var alertStats = {
    total: 0,
    totalDominations: 0,
    victories: {
        vs: 0,
        nc: 0,
        tr: 0,
        draw: 0
    },
    dominations: {
        vs: 0,
        nc: 0,
        tr: 0
    }
};

var serverStats = [];
var zoneStats   = [];
var serverZoneStats = [];

// Build Server array
for (var i = 0; i < servers.length; i++) {
    serverStats[servers[i]] = {
        vs: 0,
        nc: 0,
        tr: 0,
        draw: 0
    };
}

// Build Zone array
for (var i = 0; i < zones.length; i++) {
    zoneStats[zones[i]] = {
        vs: 0,
        nc: 0,
        tr: 0,
        draw: 0
    };
}

for (var s = 0; s < servers.length; s++) {
    serverZoneStats[servers[s]] = {};
    for (var z = 0; z < zones.length; z++) {
        serverZoneStats[servers[s]][zones[z]] = {};
        for (var f = 0; f < factions.length; f++) {
            serverZoneStats[servers[s]][zones[z]][factions[f]] = 0;
        }
    }
}

// ASYNC FUNCTIONS
setTimeout(function() {
    getTotalVictories();
}, 0);

setTimeout(function() {
    getEmpireVictories();
}, 0);

setTimeout(function() {
    getServerVictories();
}, 0);

function getTotalVictories() {
    Promise.all([
        readStatisticsAlertTotal({ Valid: 1 }),
        readStatisticsAlertTotal({ ResultDomination: 1 }),
    ]).then(function(totals) {
        alertStats.total            = totals[0];
        alertStats.totalDominations = totals[1];

        writeTotals();
    });
}

function getEmpireVictories() {
    // Initiate a promise to return all data required
    Promise.all([
        readStatisticsAlertTotal({ ResultWinner: 'vs' }),
        readStatisticsAlertTotal({ ResultWinner: 'nc' }),
        readStatisticsAlertTotal({ ResultWinner: 'tr' }),
        readStatisticsAlertTotal({ ResultWinner: 'draw' }),
        readStatisticsAlertTotal({ ResultWinner: 'vs', ResultDomination: 1 }),
        readStatisticsAlertTotal({ ResultWinner: 'nc', ResultDomination: 1 }),
        readStatisticsAlertTotal({ ResultWinner: 'tr', ResultDomination: 1 }),
    ]).then(function(totals) {
        // Write to the statistics object
        alertStats.victories.vs   = totals[0];
        alertStats.victories.nc   = totals[1];
        alertStats.victories.tr   = totals[2];
        alertStats.victories.draw = totals[3];
        alertStats.dominations.vs = totals[4];
        alertStats.dominations.nc = totals[5];
        alertStats.dominations.tr = totals[6];

        writeEmpireTotals();
    }).catch(function(error) {
        console.log(error);
    });
}

function getServerVictories() {
    Promise.all([
        readApiGet('/statistics/alert/zone')
    ]).then(function(serverTotals) {
        calculateServerZoneVictores(serverTotals[0], function() {
            console.log("server stats finished: ",serverStats);
            console.log("zone stats finished: ",zoneStats);
            console.log("Serverzone stats finished:", serverZoneStats);

            writeServerVictories();
            writeServerZoneVictories();
        });
    }).catch(function(error) {
        console.log(error);
    });
}

function calculateServerZoneVictores(data, callback) {
    for (var server in data) {
        for (var zone in data[server]) {
            for (var i = 0; i < factions.length; i++) {
                var metric = parseInt(data[server][zone][factions[i]]);

                serverStats[server][factions[i]]           += metric;
                zoneStats[zone][factions[i]]               += metric;
                serverZoneStats[server][zone][factions[i]] += metric;
            }
        }
    }

    callback();
}

function writeTotals() {
    $("#total-victory-card").find('.fa-spin').fadeOut(function() {
        $("#total-victory-card").find('.card-subtitle').html(alertStats.total).fadeIn();
    });

    $("#total-dominations-card").find('.fa-spin').fadeOut(function() {
        $("#total-dominations-card").find('.card-subtitle').html(alertStats.totalDominations).fadeIn();
    });
}

function writeEmpireTotals() {
    var empires = ['vs', 'nc', 'tr', 'draw'];

    for (var i = 0; i < empires.length; i++) {
        var elem = $('#' + empires[i] + '-victories');
        var percentage = alertStats.victories[empires[i]] / alertStats.total * 100;

        $(elem).html('<b>' + alertStats.victories[empires[i]] + '</b> / ' + percentage.toFixed(1) + '%');
    }

    // Deletes Draw for domination loop
    delete empires[3];

    for (var i = 0; i < empires.length; i++) {
        $('#' + empires[i] + '-dominations').text(alertStats.dominations[empires[i]]);
    }

    $('.victory-card .card .fa-spin').fadeOut(function() {
        $('.victory-card .card .collection').fadeIn();
    });

    // Now that all the data is here, set up the victory chart
    setUpVictoryBar();
}

function setUpVictoryBar()
{
    var data = {
        vs:    alertStats.victories.vs / alertStats.total * 100,
        nc:    alertStats.victories.nc / alertStats.total * 100,
        tr:    alertStats.victories.tr / alertStats.total * 100,
        draw:  alertStats.victories.draw / alertStats.total * 100,
        total: alertStats.total
    };

    var elem = $('#victory-territory-bar');
    elem.find('.fa-spin').fadeOut(function() {
        renderTerritoryBar(data, elem);
    });

}

function writeServerVictories() {
    for (var server in serverStats) {
        if (serverStats.hasOwnProperty(server)) {
            for (var i = 0; i < factions.length; i++) {
                var elem = $("#server-victories-body tr[data-server='"+server+"']")
                .find('.'+factions[i]);

                $(elem).html(serverStats[server][factions[i]]);
            }
        }
    }
}

function writeServerZoneVictories() {
    for (var server in serverZoneStats) {
        if (serverZoneStats.hasOwnProperty(server)) {
            for (var zone in serverZoneStats[server]) {
                for (var i = 0; i < factions.length; i++) {
                    var elem = $("#serverzone-victories-body tr[data-server='"+server+"']")
                    .find("td[data-zone='"+zone+"'][data-faction='"+factions[i]+"']");

                    $(elem).html(serverZoneStats[server][zone][factions[i]]);
                }
            }
        }
    }

    for (var zone in zoneStats) {
        for (var i = 0; i < factions.length; i++) {
            var elem = $("#serverzone-victories-body tr[data-server='totals']")
            .find("td[data-zone='"+zone+"'][data-faction='"+factions[i]+"']");

            $(elem).html(zoneStats[zone][factions[i]]);
        }
    }

}
