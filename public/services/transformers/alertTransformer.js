app.service('AlertTransformer', function($filter, ConfigDataService) {
    var factory = {};

    // Parse alert information into a standardized format
    factory.parse = function(alert) {
        alert.id = alert.id;
        alert.started = alert.started * 1000;
        alert.server = ConfigDataService.serverNames[alert.server];
        alert.zone = ConfigDataService.zoneNames[alert.zone];
        alert.winner = alert.winner.toLowerCase();
        alert.inProgress = alert.inProgress;
        // Ended only values
        alert.endedDate = null;
        alert.winnerText = null;
        alert.duration = null;
        alert.durationTime = null;
        alert.durationMins = null;

        alert.startedDate = $filter('date')(alert.started, 'dd-MMM-yyyy HH:mm:ss');

        if (alert.inProgress === false) { // Ended, fill in the nulls
            alert.ended       = alert.ended * 1000;
            alert.endedDate   = $filter('date')(alert.ended, 'dd-MMM-yyyy HH:mm:ss');

            if (alert.timeBracket == 'TES') {
                alert.timeBracket = 'Testing';
            } else {
                alert.timeBracket = ConfigDataService.timeBrackets[alert.timeBracket].label;
            }

            alert.winner      = alert.winner.toLowerCase();
            alert.winnerText  = ConfigDataService.factionsAlpha[alert.winner];

            alert.duration     = alert.ended - alert.started;
            alert.durationTime = $filter('date')(
                alert.duration - 1,
                'HH:mm:ss',
                'UTC'
            );
            alert.durationMins = Math.round((alert.duration / 1000) / 60);
        }

        return alert;
    };

    return factory;
});
