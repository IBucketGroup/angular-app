function HomePageCtrl() {

}

angular.module('homePage',[
    'ngRoute'
]).component('homePage', {
    templateUrl: '/views/home-page.html',
    controller: HomePageCtrl
});