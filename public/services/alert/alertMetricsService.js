app.service('AlertMetricsService', function(
    $routeParams,
    $http,
    AlertTransformer,
    ConfigDataService
) {
    var factory = {
        loading: true,
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

    factory.init = function() {
        factory.loading = true;
        $http({
            method : 'GET',
            url    : ConfigDataService.apiUrl + '/alerts/' + $routeParams.alert + '?embed=classes,combats,combatHistorys,mapInitials,maps,outfits,players,populations,vehicles,weapons'
        }).then(function(data) {
            var returned = data.data.data; // #Dataception

            var details = {
                started:     returned.started,
                ended:       returned.ended,
                timeBracket: returned.timeBracket,
                server:      returned.server,
                zone:        returned.zone,
                winner:      returned.winner
            };

            factory.details = AlertTransformer.parse(details);
            factory.metrics = returned;
            factory.lastMap = _.last(returned.maps.data);

            var last = factory.lastMap;
            last.controlTotal = last.controlVS + last.controlNC + last.controlTR;
            last.controlNeutral = 100 - last.controlTotal;

            factory.loading = false;
            console.log(factory);
        });
    };

    return factory;
});
