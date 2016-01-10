/* use strict */

var app = angular.module('Ps2Alerts', ['ngRoute'])
.config(function ($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: "partials/home/index.html",
            controller: "MainController"
        })
        .when('/pageTwo', {
            templateUrl: "partials/home/page2.html",
        })
        .when('/alert-history', {
            templateUrl: 'partials/alert-history/alert.history.html'
        })
        .otherwise({
            templateUrl: 'partials/common/404.html'
        });
});

app.controller('MainController', function($scope) {
    $scope.labelName = "New Button";
    $scope.newElement = angular.element('<div class="btn btn-waves">' +
        $scope.labelName + '</div>');
});

app.controller('MainPageCtrl', function($scope) {
    $scope.homePageMessage = "Hello, Matt!";
});

app.directive('navigationHeader', function() {
    return {
        templateUrl: 'partials/common/header.html'
    };
});
