/* use strict */

var app = angular.module('Ps2Alerts', ['ngRoute'])
.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: "partials/home/index.html"
        })
        .when('/pageTwo', {
            templateUrl: "partials/home/page2.html",
        })
        .otherwise({
            redirectTo: "/"
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
