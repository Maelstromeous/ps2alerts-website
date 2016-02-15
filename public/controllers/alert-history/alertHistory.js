app.controller('AlertHistoryController', function($scope, $log, ConfigDataService, AlertHistoryService) {
    $scope.data   = AlertHistoryService;
    $scope.config = ConfigDataService;

    $scope.selectedServers  = [1,10,13,17,25,1000,2000]; // Set Default
    $scope.selectedZones    = [2,4,6,8];
    $scope.selectedBrackets = ['MOR','AFT','PRI'];
    $scope.selectedFactions = ['vs','nc','tr','draw'];

    $scope.toggleServer = function(server) {
        var index = $scope.selectedServers.indexOf(server);
        if (index > -1) {
            $scope.selectedServers.splice(index, 1); // Remove element from array
        } else {
            $scope.selectedServers.push(server);
        }
    };

    $scope.toggleZone = function(zone) {
        var index = $scope.selectedZones.indexOf(zone);
        if (index > -1) {
            $scope.selectedZones.splice(index, 1); // Remove element from array
        } else {
            $scope.selectedZones.push(zone);
        }
    };

    $scope.toggleBracket = function(bracket) {
        var index = $scope.selectedBrackets.indexOf(bracket);
        if (index > -1) {
            $scope.selectedBrackets.splice(index, 1); // Remove element from array
        } else {
            $scope.selectedBrackets.push(bracket);
        }
    }

    $scope.toggleFaction = function(faction) {
        var index = $scope.selectedFactions.indexOf(faction);
        if (index > -1) {
            $scope.selectedFactions.splice(index, 1); // Remove element from array
        } else {
            $scope.selectedFactions.push(faction);
        }
    }

    $scope.filter = function() {
        $log.log($scope.selectedServers);
    }

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

    $scope.setTooltips = function() {
        setTimeout(function() {
            $('.tooltipped').tooltip({
                delay: 50
            });
        },1); // Ewwwww

    };
});
