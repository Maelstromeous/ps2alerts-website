app.controller('HomeZoneVictoryController', function($scope, HomeZoneVictoryService, ConfigDataService) {
    $scope.zoneStats = HomeZoneVictoryService;
    $scope.config = ConfigDataService;
    $scope.zoneStats.init();
    $scope.loaded = false;
    $scope.perServerShown = 'percentage'

    $scope.$on('zonesLoaded', function() {
        $scope.loaded = true;
        $scope.$apply(); // Fix for slow loading
        console.log($scope.zoneStats);

        var tips = $('#faction-victory-breakdown').find('.tooltipped');

        $(tips).each(function(index, el) {
            $(el).tooltip({delay: 50});
        });
    });

    $scope.changePerServerZone = function(mode) {
        $scope.perServerShown = mode;
        var elems = $('#server-zone-breakdown').find('.territory-bar .segment-metric');

        $(elems).each(function(index, el) {
            var newHtml = $(el).attr(mode);

            $(el).html(newHtml);
        });
    }
});
