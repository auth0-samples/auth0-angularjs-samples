(function () {

  'use strict';

  angular
    .module('app')
    .service('authService', authService);

  authService.$inject = ['$location', '$state', 'authManager', 'lock'];

  function authService($location, $state, authManager, lock) {

    function login() {
      lock.show();
    }
    
    function handleAuthentication() {
      lock.interceptHash();
      lock.on('authenticated', function(authResult) {
        if (authResult && authResult.accessToken && authResult.idToken) {
          setUser(authResult);
        } else if (authResult && authResult.error) {
          alert(authResult.error);
        }
      });
    }

    function logout() {
      localStorage.removeItem('access_token');
      localStorage.removeItem('id_token');
    }

    function isAuthenticated() {
      return authManager.isAuthenticated();
    }

    function setUser(authResult) {
      localStorage.setItem('access_token', authResult.accessToken);
      localStorage.setItem('id_token', authResult.idToken);
    }

    return {
      login: login,
      handleAuthentication: handleAuthentication,
      logout: logout,
      isAuthenticated: isAuthenticated
    }
  }
})();
