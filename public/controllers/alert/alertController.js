app.controller('AlertController', function(
    $scope,
    $q,
    AlertMetricsService
) {
    $scope.alert = AlertMetricsService;

    $scope.loaded = {
        data: false,
        leaderboards: false
    };

    $scope.$on('dataLoaded', function() {
        console.log('Data Loaded!');
        $scope.loaded.data = true;

        setTimeout(function() {
            console.log("Loading leaderboards");
            $scope.loaded.leaderboards = true;

            $(document).ready(function(){
                $('ul.tabs').tabs();
            });

            $('#playerLeaderboard').DataTable({
                data: $scope.alert.parsed.players,
                columns: [
                    { data: 'name', title: 'Player', className: 'long' },
                    { data: 'outfit', title: 'Outfit', className: 'long' },
                    { data: 'kills', title: 'Kills', className: 'metric' },
                    { data: 'deaths' , title: 'Deaths', className: 'metric' },
                    { data: 'teamkills', title: 'Teamkills', className: 'metric' },
                    { data: 'suicides', title: 'Suicides', className: 'metric' },
                    { data: 'headshots', title: 'Headshots', className: 'metric' },
                    { data: 'factionAbv', visible: false}
                ],
                order: [2, 'desc'],
                deferRender:    true,
                scrollY:        450,
                scrollCollapse: true,
                scroller:       true
            });
        }, 1);
    });

    // Instantiate the service
    $scope.alert.init();
});
