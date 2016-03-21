app.controller('PlayerProfileController', function(
    $scope,
    $window,
    $routeParams,
    PlayerProfileService
) {
    $scope.service = PlayerProfileService;

    // Instantiate the service
    $scope.service.getProfile($routeParams.id);
});
