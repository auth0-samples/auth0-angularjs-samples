(function () {

  'use strict';

  angular
    .module('app', ['auth0.auth0', 'angular-jwt', 'ui.router'])
    .config(config);

  config.$inject = [
    '$stateProvider',
    '$locationProvider',
    '$urlRouterProvider',
    '$httpProvider',
    'angularAuth0Provider',
    'jwtOptionsProvider'
  ];

  function config(
    $stateProvider,
    $locationProvider,
    $urlRouterProvider,
    $httpProvider,
    angularAuth0Provider,
    jwtOptionsProvider
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
        controllerAs: 'vm',
        onEnter: checkAuthentication
      })
      .state('ping', {
        url: '/ping',
        controller: 'PingController',
        templateUrl: 'app/ping/ping.html',
        controllerAs: 'vm',
        onEnter: checkAuthentication
      })
      .state('admin', {
        url: '/admin',
        controller: 'AdminController',
        templateUrl: 'app/admin/admin.html',
        controllerAs: 'vm',
        onEnter: checkForScopes(['write:messages'])
      })
      .state('callback', {
        url: '/callback',
        controller: 'CallbackController',
        templateUrl: 'app/callback/callback.html',
        controllerAs: 'vm'
      });

    // Initialization for the angular-auth0 library
    angularAuth0Provider.init({
      clientID: AUTH0_CLIENT_ID,
      domain: AUTH0_DOMAIN,
      responseType: 'token id_token',
      audience: AUTH0_AUDIENCE,
      redirectUri: AUTH0_CALLBACK_URL,
      scope: REQUESTED_SCOPES
    });

    jwtOptionsProvider.config({
      tokenGetter: ['authService', function(authService) {
        return authService.getAccessToken();
      }],
      whiteListedDomains: ['localhost']
    });

    $httpProvider.interceptors.push('jwtInterceptor');

    $urlRouterProvider.otherwise('/');

    $locationProvider.hashPrefix('');

    // Comment out the line below to run the app
    // without HTML5 mode (will use hashes in routes)
    $locationProvider.html5Mode(true);

    function checkAuthentication($transition$) {
      var $state = $transition$.router.stateService;
      var auth = $transition$.injector().get('authService');
      if (!auth.isAuthenticated()) {
        return $state.target('home');
      }
    }

    function checkForScopes(scopes) {
      return function checkAuthentication($transition$) {
        var $state = $transition$.router.stateService;
        var auth = $transition$.injector().get('authService');
        if (!auth.isAuthenticated() || !auth.userHasScopes(scopes)) {
          return $state.target('home');
        }
      }
    }
  }

})();
