app.service('AlertStatisticsService', function () {
    var factory = {
        total: 2,
        dominations: 0
    };

    factory.incrementTotal = function(by) {
        return factory.total += by;
    };

    return factory;
});
