getAlertHistory({});

function getAlertHistory(filters) {
    Promise.all([
        readAlertHistory()
    ]).then(function(data) {
        logDebug('Alert History promise complete');
        writeAlertHistory(data[0]);
     });
}

function readAlertHistory(filters) {
    if (filters === undefined) {
        filters = {};

        // Date stuff here
    }

    return new Promise(function(resolve, reject) {
        aja()
        .method('post')
        .url(api_url + '/statistics/alert/history')
        .data(filters)
        .on('200', function(response) {
            return resolve(response);
        })
        .on('204', function(response) {
            return reject('No data!');
        })
        .on('500', function(response) {
            return reject('Server Error!');
        })
        .go();
    });
}

// Goes through all results and writes the partials then appends to the list
function writeAlertHistory(data) {
    for (var alert in data) {
        $('#history-list').append(
            twig({ ref: "twigAlertTable"}).render(data[alert])
        );

        var metrics = {
            vs:    parseInt(data[alert].map[0].controlVS),
            nc:    parseInt(data[alert].map[0].controlNC),
            tr:    parseInt(data[alert].map[0].controlTR)
        };

        var total = (metrics.vs + metrics.nc + metrics.tr);
        var diff = 100 - total;

        if (diff < 0) {
            diff = 0;
        }

        metrics.draw = diff;

        var elem = $('#alert-' + data[alert].ResultID);

        renderTerritoryBar(metrics, elem);
    }
    // Setup tooltips for newly generated content
    fireTooltips( $('.tooltipped') );
}
