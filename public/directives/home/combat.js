app.directive('homeCombat', function() {
    return {
        restrict: 'A',
        templateUrl: 'views/home/combat/index.html'
    };
});

app.directive('homeCombatTotals', function() {
    return {
        restrict: 'A',
        templateUrl: 'views/home/combat/totals.html'
    };
});

app.directive('homeServerTops', function() {
    return {
        restrict: 'A',
        templateUrl: 'views/home/combat/server-tops.html'
    };
});
