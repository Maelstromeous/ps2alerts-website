app.controller('HomeVictoryController', function($scope, $rootScope, ConfigDataService, HomeStatisticsService) {
    $scope.today = new Date();
    $scope.alertStats = HomeStatisticsService;
    $scope.config = ConfigDataService;

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
