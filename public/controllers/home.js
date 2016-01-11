app.controller('VictoryController', function($scope, ENV) {
    $scope.today = new Date();

    $scope.baseUrl = ENV.baseUrl;
});

app.controller('ServerVictoryController', function($scope) {

});
