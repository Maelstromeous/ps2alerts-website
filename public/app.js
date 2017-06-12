/* use strict */

var app = angular.module('Ps2Alerts', [
    'ngRoute',
    'config',
    'ngCookies',
    'ngLoadScript'
]);
app.config(function($routeProvider, $locationProvider) {
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
            title: 'Leaderboards - Top Lists',
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
        .when('/project-status', {
            title: 'Project Status',
            templateUrl: 'views/project-status/index.html'
        })
        .otherwise({
            title: 'Not found!',
            templateUrl: 'views/common/404.html'
        });
    $locationProvider.html5Mode(true);
});

app.run(function($rootScope, $templateCache, AnalyticsService) {
    var analytics = AnalyticsService;

    $rootScope.$on('$routeChangeSuccess', function(event, current) {
        $templateCache.removeAll();
        $rootScope.title = current.$$route.title + ' - PS2Alerts';
    });

    $rootScope.changeTitle = function(title) {
        $rootScope.title = title + ' - PS2Alerts';
    };

    $rootScope.$on('$viewContentLoaded', function() {
        $templateCache.removeAll();
        setTimeout(function() {
            $('.tooltipped').tooltip({
                delay: 50
            });
        }, 1); // Ewwwww
    });

    $rootScope.$on('project-status', function() {
        console.log('Rendering project-status');
        $('.collapsible').collapsible({
            // A setting that changes the collapsible behavior to expandable instead of the default accordion style
            accordion: false
        });
    });
});

app.filter('ucfirst', function() {
    return function(input) {
        return input.replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
    };
});

$(window).on('load', function() {
    $('.button-collapse').sideNav({
        edge: 'left',
        closeOnClick: true
    });
    $('.tooltipped').tooltip({
        delay: 50
    });
    $('#search-tab .btn').click(function() {
        var tab = $('#search-tab');
        var opened = tab.attr('data-opened');

        tab.find('i').fadeOut();

        if (opened == 'open') {
            tab.attr('data-opened', 'closed');
            $('#site-search-container').slideUp(function() {
                tab.find('i').removeClass('fa-arrow-up');
                tab.find('i').addClass('fa-search');
                tab.find('i').fadeIn();
            });
        } else {
            tab.attr('data-opened', 'open');

            $('#site-search-container').slideDown(function() {
                tab.find('i').removeClass('fa-search');
                tab.find('i').addClass('fa-arrow-up');
                tab.find('i').fadeIn();
            });
        }
    });
});
