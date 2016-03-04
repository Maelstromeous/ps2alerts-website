app.directive('siteHeader', function() {
    return {
        templateUrl: 'views/common/header.html',
        link: function( $scope, elem, attrs ) {
            elem.ready(function(){
                $scope.$emit('ga-sync', '#header .ga-event');
            });
        }
    };
});

app.directive('siteFooter', function() {
    return {
        templateUrl: 'views/common/footer.html',
        link: function( $scope, elem, attrs ) {
            elem.ready(function(){
                $scope.$emit('ga-sync', '#footer .ga-event');
            });
        }
    };
});
