/* use strict */

var app = angular.module('Ps2Alerts', ['ngRoute', 'config']);
app.config(function ($routeProvider) {
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

app.run(function(AnalyticsService) {
    var analytics = AnalyticsService;
});

/* Global Javascript */

$(window).load(function() {
    $(".button-collapse").sideNav({
        edge: 'left',
        closeOnClick: true
    });
});
