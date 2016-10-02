(function () {
    'use strict';

    angular.module('IBucketGroup', [
        'ngSanitize',
        'ngToast',
        'app.router',
        'app.auth',
        'app.nav',
        'firebase',
        'axm.instagram'
    ]).config(['ngToastProvider', function (ngToastProvider) {
        ngToastProvider.configure({
            animation: 'slide',
            horizontalPosition: 'center',
            verticalPosition: 'top'
        });
    }]).run(function (instagramFactory, ngToast, $rootScope, $location) {
        instagramFactory.callback(function (err, user) {
            if (user) {
                console.log('User has been logged in: ', user);
                ngToast.create({
                    className: 'success',
                    content: 'Welcome ' + user.displayName
                });
                $location.hash('');
            }

            if (err) {
                console.log('Error with IG callback: ', err);
                ngToast.create({
                    className: 'error',
                    content: 'Error: ' + err.message
                });
            }
        });
    })
})();