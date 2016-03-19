app.service('SearchService', function(ConfigDataService, $http) {
    var factory = {};

    factory.searching = false;
    factory.noresults = false;
    factory.show = false;
    factory.results = [];

    factory.search = function(type, term) {
        term = encodeURIComponent(term); // Encodes into URI friendly notation
        factory.show = false;
        factory.searching = true;
        factory.noresults = false;

        console.log('search', ConfigDataService.apiUrl + '/profiles/search/' + type + '/' + term);

        $http({
            method : 'GET',
            url    : ConfigDataService.apiUrl + '/profiles/search/' + type + '/' + term
        }).then(function(returned) {
            var data = returned.data.data;
            factory.searching = false;

            console.log('returned', data);

            if (data.length > 0) {
                console.log('returned', data);

                angular.forEach(data, function(row) {
                    row.server = ConfigDataService.serverNames[row.server];
                    row.factionAbv = ConfigDataService.convertFactionIntToName(row.faction);
                });

                factory.results = data;
            } else {
                factory.noresults = true;
            }

            factory.show = true;

            console.log(factory.results);
        }, function(error) {
            console.log('Error!', error);
            factory.noresults = true;
            factory.results = [];
            factory.searching = false;
            factory.show = true;
        });
    };

    return factory;
});
