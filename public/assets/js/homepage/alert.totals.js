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
    ]).then(function(totals) {
        // Write to the statistics object
        alertStats.victories.vs   = totals[0];
        alertStats.victories.nc   = totals[1];
        alertStats.victories.tr   = totals[2];
        alertStats.victories.draw = totals[3];

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
        $('#' + empires[i] + '-victories').text(alertStats.victories[empires[i]]);
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
