"use strict";

angular
    .module('app.auth', [
        'firebase'
    ])
    .factory('Auth', [
        '$firebaseAuth',
        function ($firebaseAuth) {
            return $firebaseAuth();
        }
    ])
    .run(function ($rootScope, Auth) {
        $rootScope.auth = Auth;
        Auth.$onAuthStateChanged(function (firebaseUser) {
            $rootScope.user = firebaseUser;
            $rootScope.logged_in = !!firebaseUser;
        });
    });