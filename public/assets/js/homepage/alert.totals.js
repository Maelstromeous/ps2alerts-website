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

getTotalVictories();
getEmpireVictories();

function getTotalVictories() {
    Promise.all([
        readAlertTotals({ ResultValid: 1 }),
        readAlertTotals({ ResultDomination: 1 }),
    ]).then(function(totals) {
        alertStats.total            = totals[0];
        alertStats.totalDominations = totals[1];

        writeTotals();
    });
}

function getEmpireVictories() {
    // Initiate a promise to return all data required
    Promise.all([
        readAlertTotals({ ResultWinner: 'vs' }),
        readAlertTotals({ ResultWinner: 'nc' }),
        readAlertTotals({ ResultWinner: 'tr' }),
        readAlertTotals({ ResultWinner: 'draw' }),
        readAlertTotals({ ResultWinner: 'vs', ResultDomination: 1 }),
        readAlertTotals({ ResultWinner: 'nc', ResultDomination: 1 }),
        readAlertTotals({ ResultWinner: 'tr', ResultDomination: 1 }),
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

function writeTotals() {

}

function writeEmpireTotals() {
    var empires = ['vs', 'nc', 'tr', 'draw'];

    for (var i = 0; i < empires.length; i++) {
        var elem = $('#' + empires[i] + '-victories');
        var percentage = alertStats.victories[empires[i]] / alertStats.total * 100;

        $(elem).html('<b>' + alertStats.victories[empires[i]] + '</b> / ' + percentage.toFixed(2) + '%');
    }

    // Deletes Draw for domination loop
    delete empires[3];

    for (var i = 0; i < empires.length; i++) {
        $('#' + empires[i] + '-dominations').text(alertStats.dominations[empires[i]]);
    }

    $('.victory-card .card .fa-spin').hide();
    $('.victory-card .card .collection').fadeIn();
}

function readAlertTotals(filters) {
    return new Promise(function(resolve, reject) {
        aja()
        .method('post')
        .url(api_url + '/statistics/alert/total')
        .data(filters)
        .on('200', function(response) {
            return resolve(response[0]['COUNT']);
        })
        .on('204', function(response) {
            return reject('No data!');
        })
        .go();
    });
}
