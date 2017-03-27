(function(){
    angular
        .module('simpledropbox', [
            'ui.router',
            'validation.match',
            'angularFileUpload'
        ])
        .config(configuration);

    function configuration ($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise('/signin');

        $stateProvider
        .state('login', {
            url:'/signin',
            templateUrl: '/modules/login/login.html',
            controller: 'LoginController'
        })
        .state('home', {
            url:'/home',
            templateUrl: '/modules/upload/upload.html',
            controller: 'AppController'
        })
        .state('user', {
            url:'/signup',
            templateUrl: '/modules/user/user.html',
            controller: 'UserController'
        });
    }
})();