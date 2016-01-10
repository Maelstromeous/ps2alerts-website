app.controller('MainController', function($scope) {
    $scope.labelName = "New Button";
    $scope.newElement = angular.element('<div class="btn btn-waves">' +
        $scope.labelName + '</div>');
        
});
