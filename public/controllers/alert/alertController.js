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

            $scope.apply();
        }, 1);
    });

    // Instantiate the service
    $scope.alert.init();
});
