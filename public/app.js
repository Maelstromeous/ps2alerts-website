/* use strict */

var app = angular.module('Ps2Alerts', ['ngRoute'])
.config(function ($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: "partials/home/index.html",
            controller: "MainController"
        })
        .when('/alert-history', {
            templateUrl: 'partials/alert-history/alert.history.html'
        })
        .otherwise({
            templateUrl: 'partials/common/404.html'
        });
});

app.directive('navigationHeader', function() {
    return {
        templateUrl: 'partials/common/header.html'
    };
});
