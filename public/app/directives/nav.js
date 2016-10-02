function NavCtrl($scope, instagramFactory) {
    var auth_url = instagramFactory.getAuthUrl();
    $scope.auth_url = auth_url;
}

angular.module('app.nav', [
    'axm.instagram'
]).directive('navigation', function () {
    return {
        templateUrl: '/views/nav.html',
        controller: NavCtrl
    };
});