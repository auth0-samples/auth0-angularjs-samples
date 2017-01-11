(function () {

  'use strict';

  angular
    .module('app', ['auth0.lock', 'angular-jwt', 'ui.router'])
    .config(config);

  config.$inject = [
    '$stateProvider',
    '$locationProvider',
    '$urlRouterProvider',
    '$httpProvider',
    'lockProvider',
    'jwtOptionsProvider'
  ];

  function config(
    $stateProvider,
    $locationProvider,
    $urlRouterProvider,
    $httpProvider,
    lockProvider,
    jwtOptionsProvider
  ) {

    $stateProvider
      .state('home', {
        url: '/',
        controller: 'HomeController',
        templateUrl: 'app/home/home.html',
        controllerAs: 'vm'
      })
      .state('ping', {
        url: '/ping',
        controller: 'PingController',
        templateUrl: 'app/ping/ping.html',
        controllerAs: 'vm'
      });

    // Initialization for the angular-auth0 library
    lockProvider.init({ clientID: AUTH0_CLIENT_ID, domain: AUTH0_DOMAIN, options: {
        oidcConformant: true,
        autoclose: true,
        auth: {
          responseType: 'token id_token',
          audience: AUTH0_AUDIENCE,
          redirectUrl: AUTH0_CALLBACK_URL,
          params: {
            scope: 'openid email nickname picture'
          }
        }
      }
    });

    jwtOptionsProvider.config({
      tokenGetter: function() {
        return localStorage.getItem('access_token');
      },
      whiteListedDomains: ['localhost']
    });

    $httpProvider.interceptors.push('jwtInterceptor');

    $urlRouterProvider.otherwise('/');

    $locationProvider.hashPrefix('');

    // Uncomment the line below to run the app in HTML5 Mode.
    // Doing so will remove the hashbang from the URL.
    // $locationProvider.html5Mode(true);
  }

})();
