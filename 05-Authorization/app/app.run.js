(function () {

  'use strict';

  angular
    .module('app')
    .run(run);

  run.$inject = ['$rootScope', '$location', 'authService'];
    
  function run($rootScope, $location, authService) {
    // Handle the authentication
    // result in the hash
    authService.handleAuthentication();

    $rootScope.$on('$stateChangeStart', function(event, toState) {
      if (!toState.data) return;
      
      var isAuthenticated = authService.isAuthenticated();
      var role = authService.getRole();
      var requiresLogin = toState.data.requiresLogin;
      var accessLevel = toState.data.accessLevel;

      if (
        (requiresLogin && !isAuthenticated) ||
        (accessLevel && accessLevel !== role)
      ) {
        $location.path('/');
      }
    });

  }

})();