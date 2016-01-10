var app = angular.module('ps2alerts', []);

// ADDED IN SAME FILE ON A TEMPORARY BASIS AS I WAS HAVING MAJOR ISSUES
// INJECTING THE SERVICE DEPENDENCY TO THE FILTER
app.filter('serverName', ['dataService', function(dataService) {
    return function(input) {
        return dataService.serverNames[input];
    };
}]);

app.filter('zoneName', ['dataService', function(dataService) {
    return function(input) {
        return dataService.zoneNames[input];
    };
}]);

app.service('dataService', ['$window', function($window) {
    this.factions = ['vs','nc','tr','draw'];
    this.servers = [1,10,13,17,25,1000,2000];

    this.serverNames = {
        1: 'Connery',
        10: 'Miller',
        13: 'Cobalt',
        17: 'Emerald',
        19: 'Jaeger',
        25: 'Briggs',
        1000: 'Genudine',
        2000: 'Ceres'
    };

    this.zoneNames = {
        2: 'Indar',
        4: 'Hossin',
        6: 'Amerish',
        8: 'Esamir'
    };

    this.vsColor = '#61088F';
    this.ncColor = '#2732A8';
    this.trColor = '#A90000';
    this.drawColor = '#4B4B4B';

    this.times = {
        'PRI': 'Prime Time',
        'AFT': 'Afternoon',
        'MOR': 'Morning',
        'UNK': 'Unknown'
    };

    this.apiUrl  = $window.api_url; // Get it from Twig spitting it out
    this.baseUrl = $window.base_url;
}]);

app.controller('AlertMetricsController', ['$scope', '$q', '$http', 'dataService', function($scope, $q, $http, dataService) {
    $scope.date = new Date();
    $scope.metrics = function() {
        return $q.all([
            readStatisticsAlertTotal({ Valid: 1 }),
            readStatisticsAlertTotal({ ResultDomination: 1 }),
        ]).then(function(totals) {
            return totals;
        });
    };
}]);
