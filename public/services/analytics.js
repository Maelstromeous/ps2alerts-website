app.service('AnalyticsService', function($rootScope, $window, $location) {
    var track = function() {
        $window.ga('send', 'pageview', { page: $location.url() });
    };
    $rootScope.$on('$viewContentLoaded', track);
});
