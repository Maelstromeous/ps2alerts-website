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
        .when('/alert/:alert', {
            title: 'Alert',
            templateUrl: 'views/alert/index.html'
        })
        .when('/profiles/player/:id', {
            title: 'Player Profile',
            templateUrl: 'views/profiles/player/index.html'
        })
        .when('/profiles/outfit/:id', {
            title: 'Outfit Profile',
            templateUrl: 'views/profiles/outfit/index.html'
        })
        .when('/leaderboards', {
            title: 'Leaderboards - Top 10',
            templateUrl: 'views/leaderboards/index.html'
        })
        .when('/leaderboards/players', {
            title: 'Leaderboards - Players',
            templateUrl: 'views/leaderboards/players.html'
        })
        .when('/leaderboards/outfits', {
            title: 'Leaderboards - Outfits',
            templateUrl: 'views/leaderboards/outfits.html'
        })
        .when('/leaderboards/weapons', {
            title: 'Leaderboards - Weapons',
            templateUrl: 'views/leaderboards/weapons.html'
        })
        .when('/leaderboards/vehicles', {
            title: 'Leaderboards - Vehicles',
            templateUrl: 'views/leaderboards/vehicles.html'
        })
        .when('/change-log', {
            title: 'Change Log',
            templateUrl: 'views/change-log/index.html'
        })
        .otherwise({
            title: 'Not found!',
            templateUrl: 'views/common/404.html'
        });
    $locationProvider.html5Mode(true);
});

app.run(function($rootScope, $templateCache, AnalyticsService) {
    var analytics = AnalyticsService;

    // Disable cache on view files
    $rootScope.$on('$routeChangeStart', function(event, next, current) {
        if (typeof(current) !== 'undefined'){
            $templateCache.remove(current.templateUrl);
        }
    });

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
        console.log('Rendering project-status');
        $('.collapsible').collapsible({
            accordion : false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
        });
    });
});

app.filter('ucfirst', function() {
	return function(input,arg) {
		return input.replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
	};
});

$(window).load(function() {
    $(".button-collapse").sideNav({
        edge: 'left',
        closeOnClick: true
    });
    $(".tooltipped").tooltip({
        delay: 50
    });
});
