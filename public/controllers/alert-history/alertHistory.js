app.controller('AlertHistoryController', function($scope, ConfigDataService, AlertHistoryService) {
    $scope.data = AlertHistoryService;
    $scope.config = ConfigDataService;

    setTimeout(function() {
        $('select').material_select();
        $('.datepicker').pickadate({
            selectMonths: true, // Creates a dropdown to control month
            selectYears: 15 // Creates a dropdown of 15 years to control year
        });
    })
});
