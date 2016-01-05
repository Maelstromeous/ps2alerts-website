// Contains the functions required for interacting with the endpiints

function readApiGet(url) {
    logDebug('Calling API:');
    logDebug(url);
    return new Promise(function(resolve, reject) {
        aja()
        .method('get')
        .url(api_url + url)
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

function readStatisticsAlertTotal(filters) {
    var data = {
        wheres : filters
    };

    return new Promise(function(resolve, reject) {
        aja()
        .method('post')
        .url(api_url + '/statistics/alert/total')
        .data(data)
        .on('200', function(response) {
            return resolve(response[0]['COUNT']);
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
