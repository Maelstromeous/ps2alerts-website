app.controller('AlertHistoryController', function($scope, $log, ConfigDataService, AlertHistoryService) {
    $scope.data   = AlertHistoryService;
    $scope.config = ConfigDataService;

    $scope.filters = {};
    $scope.filters.servers  = [1,10,13,17,25,1000,2000]; // Set Default
    $scope.filters.zones    = [2,4,6,8];
    $scope.filters.brackets = ['MOR','AFT','PRI'];
    $scope.filters.factions = ['vs','nc','tr','draw'];

    $scope.setTooltips = function() {
        setTimeout(function() {
            $('.tooltipped').tooltip({
                delay: 50
            });
        },1); // Ewwwww
    };

    $scope.applyFilter = function() {
        $scope.data.resetData();
        $scope.data.applyFilter($scope.filters);
    };

    $scope.applyFilter();

    $scope.toggleServer = function(server) {
        var index = $scope.filters.servers.indexOf(server);
        if (index > -1) {
            $scope.filters.servers.splice(index, 1); // Remove element from array
        } else {
            $scope.filters.servers.push(server);
        }
    };

    $scope.toggleZone = function(zone) {
        var index = $scope.filters.zones.indexOf(zone);
        if (index > -1) {
            $scope.filters.zones.splice(index, 1); // Remove element from array
        } else {
            $scope.filters.zones.push(zone);
        }
    };

    $scope.toggleBracket = function(bracket) {
        var index = $scope.filters.brackets.indexOf(bracket);
        if (index > -1) {
            $scope.filters.brackets.splice(index, 1); // Remove element from array
        } else {
            $scope.filters.brackets.push(bracket);
        }
    };

    $scope.toggleFaction = function(faction) {
        var index = $scope.filters.factions.indexOf(faction);
        if (index > -1) {
            $scope.filters.factions.splice(index, 1); // Remove element from array
        } else {
            $scope.filters.factions.push(faction);
        }
    };

    $scope.filter = function() {
        $log.log($scope.filters.servers);
    };

    $scope.started = new Date('2014-10-30');
    $scope.today   = new Date();

    $scope.minDate = new Date(
        $scope.started.getFullYear(),
        $scope.started.getMonth(),
        $scope.started.getDate()
    );

    $scope.maxDate = new Date(
        $scope.started.getFullYear(),
        $scope.started.getMonth(),
        $scope.started.getDate()
    );

    $scope.dateFrom = new Date();
    $scope.dateTo   = new Date();
});
