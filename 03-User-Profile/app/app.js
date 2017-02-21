(function () {

  'use strict';

  angular
    .module('app', ['auth0.lock', 'ui.router'])
    .config(config);

  config.$inject = [
    '$stateProvider',
    '$locationProvider',
    '$urlRouterProvider',
    'lockProvider'
  ];

  function config(
    $stateProvider,
    $locationProvider,
    $urlRouterProvider,
    lockProvider
  ) {

    $stateProvider
      .state('home', {
        url: '/',
        controller: 'HomeController',
        templateUrl: 'app/home/home.html',
        controllerAs: 'vm'
      })
      .state('profile', {
        url: '/profile',
        controller: 'ProfileController',
        templateUrl: 'app/profile/profile.html',
        controllerAs: 'vm'
      })
      .state('callback', {
        url: '/callback',
        controller: 'CallbackController',
        templateUrl: 'app/callback/callback.html',
        controllerAs: 'vm'
      });

    // Initialization for the angular-auth0 library
    lockProvider.init({ clientID: AUTH0_CLIENT_ID, domain: AUTH0_DOMAIN, options: {
        oidcConformant: true,
        autoclose: true,
        auth: {
          responseType: 'token id_token',
          audience: 'https://' + AUTH0_DOMAIN + '/userinfo',
          redirectUrl: AUTH0_CALLBACK_URL,
          params: {
            scope: 'openid profile'
          }
        }
      }
    });

    $urlRouterProvider.otherwise('/');

    $locationProvider.hashPrefix('');

    // Comment out the line below to run the app
    // without HTML5 mode (will use hashes in routes)
    $locationProvider.html5Mode(true);
  }

})();
