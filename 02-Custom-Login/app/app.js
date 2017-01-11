(function () {

  'use strict';

  angular
    .module('app', ['auth0.auth0', 'angular-jwt', 'ui.router'])
    .config(config);

  config.$inject = [
    '$stateProvider',
    '$locationProvider',
    '$urlRouterProvider',
    'angularAuth0Provider',
    'jwtOptionsProvider'
  ];

  function config(
    $stateProvider,
    $locationProvider,
    $urlRouterProvider,
    angularAuth0Provider,
    jwtOptionsProvider
  ) {

    $stateProvider
      .state('home', {
        url: '/home',
        controller: 'HomeController',
        templateUrl: 'app/home/home.html',
        controllerAs: 'vm'
      })
      .state('login', {
        url: '/login',
        controller: 'LoginController',
        templateUrl: 'app/login/login.html',
        controllerAs: 'vm'
      });

    // Initialization for the angular-auth0 library
    angularAuth0Provider.init({
      clientID: AUTH0_CLIENT_ID,
      domain: AUTH0_DOMAIN,
      responseType: 'token id_token',
      audience: 'https://' + AUTH0_DOMAIN + '/userinfo',
      redirectUri: AUTH0_CALLBACK_URL
    });

    jwtOptionsProvider.config({
      tokenGetter: function() {
        return localStorage.getItem('id_token');
      }
    });

    $urlRouterProvider.otherwise('/home');

    // Uncomment the line below to run the app in HTML5 Mode.
    // Doing so will remove the hashbang from the URL.
    // $locationProvider.html5Mode(true);
  }

})();
