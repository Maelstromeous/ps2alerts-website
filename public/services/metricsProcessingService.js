app.service('MetricsProcessingService', function() {
    var factory = {};

    // Calculate KD
    factory.calcKD = function(kills, deaths) {
        var kd =
        parseFloat((kills / deaths).toFixed(2));

        if (kd == 'Infinity' || isNaN(kd)) {
            kd = kills;
        }

        return kd;
    };

    // Calculate Headshot Ratio
    factory.calcHSR = function (headshots, kills) {
        var hsr = parseFloat((headshots / kills * 100).toFixed(2));

        if (hsr == 'Infinity' || isNaN(hsr)) {
            hsr = kills;
        }

        return hsr;
    };

    return factory;
});
