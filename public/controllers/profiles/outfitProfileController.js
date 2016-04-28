app.controller('OutfitProfileController', function(
    $scope,
    $window,
    $routeParams,
    OutfitProfileService,
    ConfigDataService
) {
    $scope.service = OutfitProfileService;
    $scope.loaded = false;
    $scope.config = ConfigDataService;

    // Instantiate the service
    $scope.service.getProfile($routeParams.id);

    $scope.$on('dataLoaded', function() {
        console.log('event');
        $scope.loaded = true;
        $scope.$apply();

        $scope.$emit('ga-sync', '#outfit-profile .ga-event');

        $('#alert-list').DataTable({
            data: $scope.service.data.involvement.data,
            columns: [
                { data: 'id', title: 'ID', className: 'id center-align' },
                { data: 'kills', title: 'Kills', className: 'metric center-align' },
                { data: 'deaths', title: 'Deaths', className: 'metric center-align' },
                { data: 'teamkills' , title: 'TeamKills', className: 'metric center-align' },
                { data: 'suicides' , title: 'Suicides', className: 'metric center-align' }
            ],
            order:          [0, 'desc'],
            deferRender:    true,
            scrollY:        450,
            scrollCollapse: true,
            scroller:       true,
            searching:      false,
            "rowCallback": function( row, data, index ) {
                $('.id', row).html('<a href="alert/' + data.id + '">' + data.id + '</a>');
            }
        });
    });
});
