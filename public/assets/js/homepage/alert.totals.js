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

// Total Alerts
aja()
.method('post')
.url(api_url + '/statistics/alert/total')
.on('200', function(response) {
    alertStats.total = response[0]['COUNT'];
})
.go();

// Total Dominations
aja()
.method('post')
.url(api_url + '/statistics/alert/total')
.data({ ResultDomination: 1})
.on('200', function(response) {
    alertStats.totalDominations = response[0]['COUNT'];
})
.go();

// VS Victories
aja()
.method('post')
.url(api_url + '/statistics/alert/total')
.data({ ResultWinner: 'vs'})
.on('200', function(response) {
    alertStats.victories.vs = response[0]['COUNT'];
})
.go();

// NC Victories
aja()
.method('post')
.url(api_url + '/statistics/alert/total')
.data({ ResultWinner: 'nc'})
.on('200', function(response) {
    alertStats.victories.nc = response[0]['COUNT'];
})
.go();

// TR Victories
aja()
.method('post')
.url(api_url + '/statistics/alert/total')
.data({ ResultWinner: 'tr'})
.on('200', function(response) {
    alertStats.victories.tr = response[0]['COUNT'];
})
.go();

// TR Victories
aja()
.method('post')
.url(api_url + '/statistics/alert/total')
.data({ ResultDraw: 1})
.on('200', function(response) {
    alertStats.victories.tr = response[0]['COUNT'];
})
.go();
