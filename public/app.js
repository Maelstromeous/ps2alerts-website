/* use strict */

var app = angular.module('Ps2Alerts', ['ngRoute', 'config'])
.config(function ($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'views/home/index.html'
        })
        .when('/alert-history', {
            templateUrl: 'views/alert-history/index.html'
        })
        .otherwise({
            templateUrl: 'views/common/404.html'
        });
});
