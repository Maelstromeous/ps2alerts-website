app.service('AlertTransformer', function($filter, ConfigDataService) {
    var factory = {};

    // Parse alert information into a standardized format
    factory.parse = function(alert) {
        alert.winner      = alert.winner.toLowerCase();
        alert.started     = alert.started * 1000;
        alert.ended       = alert.ended * 1000;
        alert.endedDate   = $filter('date')(alert.ended, 'dd-MMM-yyyy HH:mm:ss');
        alert.timeBracket = ConfigDataService.timeBrackets[alert.timeBracket].label;
        alert.server      = ConfigDataService.serverNames[alert.server];
        alert.zone        = ConfigDataService.zoneNames[alert.zone];
        alert.winnerText  = ConfigDataService.factionsAlpha[alert.winner];

        alert.duration     = alert.ended - alert.started;
        alert.durationTime = $filter('date')(alert.duration - 1, 'HH:mm:ss', 'UTC');
        alert.durationMins = Math.round((alert.duration / 1000) / 60);

        return alert;
    };

    return factory;
});
