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

            $('#player-leaderboard').DataTable({
                data: $scope.alert.parsed.players,
                columns: [
                    { data: 'name', title: 'Player', className: 'long name' },
                    { data: 'outfit', title: 'Outfit', className: 'long outfit' },
                    { data: 'kills', title: 'Kills', className: 'metric' },
                    { data: 'deaths' , title: 'Deaths', className: 'metric' },
                    { data: 'teamkills', title: 'Teamkills', className: 'metric' },
                    { data: 'suicides', title: 'Suicides', className: 'metric' },
                    { data: 'headshots', title: 'Headshots', className: 'metric' },
                    { data: 'factionAbv', visible: false },
                    { data: 'outfitTag', visible: false }
                ],
                order:          [2, 'desc'],
                deferRender:    true,
                scrollY:        450,
                scrollCollapse: true,
                scroller:       true,
                "rowCallback": function( row, data, index ) {
                    // Format the cells
                    if ( data.factionAbv !== null ) {
                        $('.name', row).addClass(data.factionAbv + '-table-text');
                        $('.outfit', row).addClass(data.factionAbv + '-table-text');
                    }

                    // Add outfit tags
                    if (data.outfitTag !== null) {
                        $('.outfit', row).html('['+data.outfitTag+'] '+data.outfit);
                    }
                }
            });

            $('#outfit-leaderboard').DataTable({
                data: $scope.alert.parsed.outfits,
                columns: [
                    { data: 'name', title: 'Outfit', className: 'long name' },
                    { data: 'participants', title: 'Participants', className: 'metric'},
                    { data: 'kills', title: 'Kills', className: 'metric' },
                    { data: 'deaths' , title: 'Deaths', className: 'metric' },
                    { data: 'kd' , title: 'K/D', className: 'metric' },
                    { data: 'teamkills', title: 'Teamkills', className: 'metric' },
                    { data: 'suicides', title: 'Suicides', className: 'metric' },
                    { data: 'captures', title: 'Captures', className: 'metric' },
                    { data: 'tag', title: 'Tag', className: 'long', visible: false },
                    { data: 'factionAbv', visible: false }
                ],
                order:          [2, 'desc'],
                deferRender:    true,
                scrollY:        450,
                scrollCollapse: true,
                scroller:       true,
                "rowCallback": function( row, data, index ) {
                    // Format the cells
                    if ( data.factionAbv !== null ) {
                        $('.name', row).addClass(data.factionAbv + '-table-text');
                    }

                    // Add outfit tags
                    if (data.tag !== null) {
                        $('.name', row).html('['+data.tag+'] '+data.name);
                    }
                }
            });

            $(document).ready(function(){
                $('ul.tabs').tabs();
            });
        }, 1);
    });

    // Instantiate the service
    $scope.alert.init();
});
