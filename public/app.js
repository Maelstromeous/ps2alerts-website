/* use strict */

var app = angular.module('Ps2Alerts', [
    'ngRoute',
    'config',
    'ngLoadScript'
]);
app.config(function ($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'views/home/index.html'
        })
        .when('/alert-history', {
            templateUrl: 'views/alert-history/index.html'
        })
        .when('/about', {
            templateUrl: 'views/about/index.html'
        })
        .when('/leaderboards', {
            templateUrl: 'views/leaderboard/index.html'
        })
        .when('/alert/:alert', {
            templateUrl: 'views/alert/index.html'
        })
        .otherwise({
            templateUrl: 'views/common/404.html'
        });
});

app.run(function($rootScope, AnalyticsService) {
    var analytics = AnalyticsService;

    $rootScope.$on('$viewContentLoaded', function() {
        setTimeout(function() {
            $('.tooltipped').tooltip({
                delay: 50
            });
        },1); // Ewwwww
    });
});

/* Global Javascript */

$(window).load(function() {
    $(".button-collapse").sideNav({
        edge: 'left',
        closeOnClick: true
    });
    $(".tooltipped").tooltip({
        delay: 50
    });
});
