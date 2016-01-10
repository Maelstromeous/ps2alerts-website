/* use strict */

var app = angular.module('Ps2Alerts', ['ngRoute'])
.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
    $routeProvider
        .when('', {
            templateUrl: "partials/home/index.html",
            controller: "MainPageCtrl"
        })
        .when('/pageTwo', {
            templateUrl: "partials/home/page2.html",
        })
        .otherwise({
            templateUrl: "partials/common/404.html"
        });

    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
}]);

app.controller('MainController', function($scope) {
    $scope.labelName = "New Button";
    $scope.newElement = angular.element('<div class="btn btn-waves">' +
        $scope.labelName + '</div>');

});

app.controller('MainPageCtrl', function($scope) {
    $scope.homePageMessage = "Hello, Matt!";
});
