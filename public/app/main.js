(function () {
    'use strict';

    angular.module('IBucketGroup', [
        'ngSanitize',
        'ngToast',
        'app.router',
        'firebase'
    ]).config(['ngToastProvider', function (ngToastProvider) {
        ngToastProvider.configure({
            animation: 'slide',
            horizontalPosition: 'center',
            verticalPosition: 'top'
        });
    }]);
})();