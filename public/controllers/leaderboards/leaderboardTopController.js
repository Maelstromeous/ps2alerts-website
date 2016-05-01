app.controller('LeaderboardTopController', function(
    $scope,
    $window,
    $routeParams,
    LeaderboardTopService,
    ConfigDataService,
    MetricsProcessingService
) {
    $scope.service = LeaderboardTopService;
    $scope.config = ConfigDataService;

    $scope.limit = $scope.service.limit;

    $scope.playersLoaded = false;
    $scope.playersServer = 0;
    $scope.playersSorting = 'kills';
    $scope.playersSortingOptions = ['kills', 'deaths', 'teamkills', 'suicides', 'headshots'];

    $scope.outfitsLoaded = false;
    $scope.outfitsServer = 0;
    $scope.outfitsSorting = 'kills';
    $scope.outfitsSortingOptions = ['kills', 'deaths', 'teamkills', 'suicides', 'captures'];

    $scope.service.getConfig();

    $scope.changePlayerServer = function(server) {
        $scope.playersServer = server;
        $scope.getTopPlayers();
    };

    $scope.changePlayerSorting = function(sorting) {
        $scope.playersSorting = sorting;
        $scope.getTopPlayers();
    };

    $scope.changeOutfitServer = function(server) {
        $scope.outfitsServer = server;
        $scope.getTopOutfits();
    };

    $scope.changeOutfitSorting = function(sorting) {
        $scope.outfitsSorting = sorting;
        $scope.getTopOutfits();
    };

    $scope.getTopPlayers = function() {
        $scope.playersLoaded = false;
        $scope.service.getTopPlayers($scope.playersServer, $scope.playersSorting);
    };

    $scope.getTopOutfits = function() {
        $scope.outfitsLoaded = false;
        $scope.service.getTopOutfits($scope.outfitsServer, $scope.outfitsSorting);
    };

    $scope.changeTab = function(tab) {
        setTimeout(function() {
            var table = $('#top-' + tab).DataTable();
            table.draw();
        }, 200);
    }

    $scope.$on('configReady', function() {

        // Houston, We are go.
        $scope.getTopPlayers();
        $scope.getTopOutfits();
    });

    $scope.$on('players-loaded', function(event) {
        console.log('Players loaded for server: ' + $scope.playersServer);
        $scope.playersLoaded = true;

        if ( $.fn.DataTable.isDataTable('#top-players') ) {
            var table = $('#top-players').DataTable();
            table.clear();
            table.rows.add($scope.service.playerData);
            table.draw();
        } else {
            $scope.initPlayerDataTable();
        }

        //$scope.$emit('ga-sync', '#leaderboard-top-10 .ga-event');
    })

    $scope.$on('outfits-loaded', function(event) {
        console.log('Outfits loaded for server: ' + $scope.outfitsServer);
        $scope.outfitsLoaded = true;

        if ( $.fn.DataTable.isDataTable('#top-outfits') ) {
            var table = $('#top-outfits').DataTable();
            table.clear();
            table.rows.add($scope.service.outfitData);
            table.draw();
        } else {
            $scope.initOutfitDataTable();
        }

        $('ul.tabs').tabs();

        //$scope.$emit('ga-sync', '#leaderboard-top-10 .ga-event');
    })

    $scope.initPlayerDataTable = function() {
        $('#top-players').DataTable({
            data: $scope.service.playerData,
            columns: [
                { data: 'pos', title: '#', className: 'pos center-align' },
                { data: 'name', title: 'Player', className: 'name' },
                { data: 'outfitName', title: 'Outfit', className: 'outfit' },
                { data: 'serverName', title: 'Server', className: 'center-align' },
                { data: 'kills', title: 'Kills', className: 'metric center-align' },
                { data: 'deaths', title: 'Deaths', className: 'metric center-align' },
                { data: 'teamkills', title: 'TKs', className: 'metric center-align' },
                { data: 'suicides', title: 'Suicides', className: 'metric center-align' },
                { data: 'headshots', title: 'Headshots', className: 'metric center-align' },
                { data: 'id', visible: false }
            ],
            order:          [3, 'desc'],
            deferRender:    true,
            scrollY:        380,
            scrollCollapse: true,
            scroller:       true,
            searching:      true,
            ordering:       false,
            "rowCallback": function( row, data, index ) {
                // Format the faction colors
                if (data.factionAbv !== null) {
                    $('.pos', row).addClass(data.factionAbv + '-table-text');
                }

                $('.name', row).html('<a href="profiles/player/' + data.id + '">' + data.name + '</a>');
                if (data.outfitId) {
                    $('.outfit', row).html('<a href="profiles/outfit/' + data.outfitId + '">' + data.outfitName + '</a>');
                }
            }
        });
    }

    $scope.initOutfitDataTable = function() {
        $('#top-outfits').DataTable({
            data: $scope.service.outfitData,
            columns: [
                { data: 'pos', title: '#', className: 'pos center-align' },
                { data: 'name', title: 'Player', className: 'name' },
                { data: 'tag', title: 'Tag', className: 'tag center-align' },
                { data: 'serverName', title: 'Server', className: 'center-align' },
                { data: 'kills', title: 'Kills', className: 'metric center-align' },
                { data: 'deaths', title: 'Deaths', className: 'metric center-align' },
                { data: 'teamkills', title: 'TKs', className: 'metric center-align' },
                { data: 'suicides', title: 'Suicides', className: 'metric center-align' },
                { data: 'captures', title: 'Captures', className: 'metric center-align' },
                { data: 'id', visible: false }
            ],
            order:          [3, 'desc'],
            deferRender:    true,
            scrollY:        380,
            scrollCollapse: true,
            scroller:       true,
            searching:      true,
            ordering:       false,
            "rowCallback": function( row, data, index ) {
                // Format the faction colors
                if (data.factionAbv !== null) {
                    $('.pos', row).addClass(data.factionAbv + '-table-text');
                    $('.tag', row).addClass(data.factionAbv + '-table-text');
                }

                $('.name', row).html('<a href="profiles/outfit/' + data.id + '">' + data.name + '</a>');
            }
        });
    }
});
