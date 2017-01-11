(function () {

  'use strict';

  angular
    .module('app')
    .service('authService', authService);

  authService.$inject = ['$location', '$state', 'authManager', 'lock'];

  function authService($location, $state, authManager, lock) {

    var userProfile;

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

    function fetchProfile(cb) {
      var accessToken = localStorage.getItem('access_token');
      if (!accessToken) {
        throw 'Access token must exist to fetch profile';
      }
      lock.getUserInfo(accessToken, function(err, profile) {
        if (profile) {
          setUserProfile(profile);
        }
        cb(err, profile);
      });
    }

    function setUserProfile(profile) {
      userProfile = profile;
    }

    function getCachedProfile() {
      return userProfile;
    }

    // Logging out just requires removing the user's
    // id_token and profile
    function logout() {
      localStorage.removeItem('access_token');
      localStorage.removeItem('id_token');
      localStorage.removeItem('profile');
      $state.go('home');
    }

    function isAuthenticated() {
      return authManager.isAuthenticated();
    }

    function setUser(authResult) {
      localStorage.setItem('access_token', authResult.accessToken);
      localStorage.setItem('id_token', authResult.idToken);
    }

    function getRole() {
      var namespace = 'https://example.com';
      var idToken = localStorage.getItem('id_token');
      return jwt_decode(idToken)[namespace + '/role'] || null;
    }

    function isAdmin() {
      return getRole() === 'admin';
    }

    return {
      login: login,
      fetchProfile: fetchProfile,
      getCachedProfile: getCachedProfile,
      handleAuthentication: handleAuthentication,
      logout: logout,
      isAuthenticated: isAuthenticated,
      getRole: getRole,
      isAdmin: isAdmin
    }
  }
})();
