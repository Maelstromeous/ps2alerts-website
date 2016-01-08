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

function writeAlertHistory(data) {
    for (var alert in data) {
        console.log(data[alert]);

        var html = '<div class="alert-history-row">';
        
    }

    console.log(data);
}
