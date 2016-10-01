(function () {
    'use strict';

    function config($locationProvider, $routeProvider) {
        $locationProvider.hashPrefix('!');

        $routeProvider.when('/', {
            template: '<home-page></home-page>'
        }).otherwise('/');
    }

    angular.module('app.router', [
        'ngRoute',
        'homePage'
    ]).config(['$locationProvider', '$routeProvider', config]);
})();
