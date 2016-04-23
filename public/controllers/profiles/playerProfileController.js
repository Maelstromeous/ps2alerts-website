app.controller('PlayerProfileController', function(
    $scope,
    $window,
    $routeParams,
    PlayerProfileService
) {
    $scope.service = PlayerProfileService;
    $scope.loaded = false;

    // Instantiate the service
    $scope.service.getProfile($routeParams.id);

    $scope.$on('dataLoaded', function() {
        console.log('event');
        $scope.loaded = true;
        $scope.$apply();
    });
});
