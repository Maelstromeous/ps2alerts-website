/* use strict */

var app = angular.module('Ps2Alerts', [
    'ngRoute',
    'config',
    'ngLoadScript'
]);
app.config(function ($routeProvider, $locationProvider) {
    $routeProvider
        .when('/', {
            title: 'Home',
            templateUrl: 'views/home/index.html'
        })
        .when('/alert-history', {
            title: 'Alert History',
            templateUrl: 'views/alert-history/index.html'
        })
        .when('/about', {
            title: 'About PS2Alerts',
            templateUrl: 'views/about/index.html'
        })
        .when('/leaderboards', {
            title: 'Leaderboards',
            templateUrl: 'views/leaderboard/index.html'
        })
        .when('/alert/:alert', {
            title: 'Alert',
            templateUrl: 'views/alert/index.html'
        })
        .otherwise({
            title: 'Not found!',
            templateUrl: 'views/common/404.html'
        });
    $locationProvider.html5Mode(true);
});

app.run(function($rootScope, AnalyticsService) {
    var analytics = AnalyticsService;

    $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
        $rootScope.title = current.$$route.title + ' - PS2Alerts';
    });

    $rootScope.changeTitle = function(title) {
        $rootScope.title = title + ' - PS2Alerts';
    };

    $rootScope.$on('$viewContentLoaded', function() {
        setTimeout(function() {
            $('.tooltipped').tooltip({
                delay: 50
            });
        },1); // Ewwwww
    });

    $rootScope.$on('project-status', function() {
        setTimeout(function() {
            console.log('Rendering project-status');
            $('.collapsible').collapsible({
                accordion : false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
            });
        });
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
