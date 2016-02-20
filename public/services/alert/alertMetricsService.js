app.service('AlertMetricsService', function($routeParams, $http, ConfigDataService) {
    console.log($routeParams);

    var factory = {
        // Initialize the data properties of each metric so it can be shortcutted
        metrics: {
            combats: {
                data: {}
            },
            combatHistorys: {
                data: {}
            },
            mapInitials: {
                data: {}
            },
            maps: {
                data: {}
            },
            outfits: {
                data: {}
            },
            players: {
                data: {}
            },
            populations: {
                data: {}
            },
            vehicles: {
                data: {}
            },
            weapons: {
                data: {}
            }
        }
    };
    
    var alertID = $routeParams.alert;

    $http({
        method : 'GET',
        url    : ConfigDataService.apiUrl + '/alerts/' + alertID + '?embed=classes,combats,combatHistorys,mapInitials,maps,outfits,players,populations,vehicles,weapons'
    }).then(function(data) {
        var returned = data.data.data; // #Dataception

        factory.metrics = returned;

        console.log(factory);
    });

    return factory;
});
