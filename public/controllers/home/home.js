app.controller('HomeVictoryController', function($scope, ConfigDataService, HomeStatisticsService) {
    $scope.today = new Date();
    $scope.alertStats = HomeStatisticsService;
    $scope.config = ConfigDataService;

    $scope.project = {
        title: 'Project Status: Homepage',
        subtitle: 'The statistics shown on this page will be expanded upon soon. Check below for details',
        updated: 'Friday 4th March 2016',
        completed: [
            'Basic Statistics (Total Victories, Faction Victories)',
            'Server Victories',
        ],
        inprogress: [
            'Nothing currently, working on Alert Statistics',
        ],
        notstarted: [
            'Continent Victories',
            'Victory Timeline',
            'Rolling Victory Averages',
            'Last Week & Last Month metrics'
        ]
    };
    
    $('body').on('click', "#announcement-view-more", function() {
        var expanded = $("#announcement-view-more").attr('expanded');
        console.log(expanded);

        if (expanded == "0") {
            $("#announcement-more").slideDown();
            $("#announcement-last").removeClass('row-no-margin');
            $("#announcement-view-more").html('Hide').attr('expanded', 1);
        } else {
            $("#announcement-more").slideUp();
            $("#announcement-last").addClass('row-no-margin');
            $("#announcement-view-more").html('Read more...').attr('expanded', 0);
        }
    });
});

app.controller('HomeTimelineController', function ($scope) {

});

app.controller('HomeZoneVictoryController', function($scope, HomeZoneStatisticsService) {
    $scope.zoneStats = HomeZoneStatisticsService;
});
