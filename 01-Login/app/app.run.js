(function () {

  'use strict';

  angular
    .module('app')
    .run(run);

  run.$inject = ['authService'];

  function run(authService) {

    if (localStorage.getItem('isLoggedIn') === 'true') {
      authService.renewTokens();
    } else {
      // Handle the authentication
      // result in the hash
      authService.handleAuthentication();
    }
  }

})();