function HomePageCtrl($scope, $firebaseObject) {
    var ref = firebase.database().ref('/foo');
    var syncObject = $firebaseObject(ref);
    syncObject.$bindTo($scope, 'data');
}

angular.module('homePage',[
    'ngRoute'
]).component('homePage', {
    templateUrl: '/views/home-page.html',
    controller: HomePageCtrl
});